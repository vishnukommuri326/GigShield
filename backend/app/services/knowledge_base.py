# backend/app/services/knowledge_base.py

import os
from typing import List, Dict, Any, Optional
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer

class KnowledgeBaseService:
    def __init__(self):
        """Initialize knowledge base with Pinecone vector database"""
        self.documents = self._load_documents()
        self.use_pinecone = bool(os.getenv("PINECONE_API_KEY"))
        
        if self.use_pinecone:
            # Initialize Pinecone
            self.pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
            self.index_name = "gigshield-knowledge"
            
            # Initialize embedding model
            self.encoder = SentenceTransformer('all-MiniLM-L6-v2')  # 384 dimensions
            
            # Create or connect to index
            self._setup_index()
            
            # Index documents if not already indexed
            self._index_documents()
            
            print("✓ Pinecone vector search enabled")
        else:
            print("⚠ Pinecone not configured - using keyword search fallback")
    
    def _setup_index(self):
        """Create Pinecone index if it doesn't exist"""
        try:
            # Check if index exists
            existing_indexes = [index.name for index in self.pc.list_indexes()]
            
            if self.index_name not in existing_indexes:
                print(f"Creating Pinecone index: {self.index_name}")
                self.pc.create_index(
                    name=self.index_name,
                    dimension=384,  # all-MiniLM-L6-v2 dimensions
                    metric='cosine',
                    spec=ServerlessSpec(
                        cloud='aws',
                        region='us-east-1'
                    )
                )
                print(f"✓ Index '{self.index_name}' created")
            
            # Connect to index
            self.index = self.pc.Index(self.index_name)
            
        except Exception as e:
            print(f"❌ Error setting up Pinecone index: {e}")
            self.use_pinecone = False
    
    def _index_documents(self):
        """Index documents into Pinecone with embeddings"""
        try:
            # Check if documents are already indexed
            stats = self.index.describe_index_stats()
            if stats.total_vector_count >= len(self.documents):
                print(f"✓ Documents already indexed ({stats.total_vector_count} vectors)")
                return
            
            print(f"Indexing {len(self.documents)} documents...")
            
            vectors = []
            for doc in self.documents:
                # Create text to embed (combine title and content)
                text = f"{doc['title']}. {doc['content']}"
                
                # Generate embedding
                embedding = self.encoder.encode(text).tolist()
                
                # Prepare metadata (filter out None values - Pinecone doesn't accept null)
                metadata = {
                    'id': doc['id'],
                    'title': doc['title'],
                    'category': doc['category'],
                    'content_preview': doc['content'][:500],  # First 500 chars
                    'tags': ','.join(doc['tags'])
                }
                
                # Add optional fields only if they have values
                if doc['state']:
                    metadata['state'] = doc['state']
                if doc['platform']:
                    metadata['platform'] = doc['platform']
                
                vectors.append({
                    'id': doc['id'],
                    'values': embedding,
                    'metadata': metadata
                })
            
            # Upsert vectors in batches
            self.index.upsert(vectors=vectors)
            print(f"✓ Indexed {len(vectors)} documents to Pinecone")
            
        except Exception as e:
            print(f"❌ Error indexing documents: {e}")
            self.use_pinecone = False
        
    def _load_documents(self) -> List[Dict[str, Any]]:
        """Load knowledge base documents from Firestore"""
        from app.core.firebase import db
        
        try:
            # Fetch all documents from knowledge_base collection
            docs_ref = db.collection('knowledge_base').stream()
            documents = []
            
            for doc in docs_ref:
                data = doc.to_dict()
                # Convert to expected format
                documents.append({
                    'id': data.get('id', doc.id),
                    'title': data.get('title', ''),
                    'category': data.get('category', ''),
                    'state': data.get('state', 'All'),
                    'platform': data.get('platform', 'All'),
                    'content': data.get('content', ''),
                    'tags': data.get('tags', [])
                })
            
            if documents:
                print(f"✓ Loaded {len(documents)} documents from Firestore")
                return documents
            else:
                print("⚠ No documents found in Firestore, using fallback")
                return self._get_fallback_documents()
                
        except Exception as e:
            print(f"❌ Error loading from Firestore: {e}")
            print("⚠ Using fallback hardcoded documents")
            return self._get_fallback_documents()
    
    def _get_fallback_documents(self) -> List[Dict[str, Any]]:
        """Fallback hardcoded documents if Firestore fails"""
        return [
            {
                "id": "ca-ab5",
                "title": "California AB5 - Worker Classification",
                "category": "State Laws",
                "state": "California",
                "platform": "All",
                "content": """California AB5 (2019) established the ABC test for determining worker classification. 
                Key Points:
                - Employers must prove workers are independent contractors, not employees
                - Three-part ABC test must be met
                - Right to detailed explanation for deactivation
                - Right to appeal with human review
                - Cannot be deactivated for declining low-paying orders
                - Protection against arbitrary deactivation
                
                Relevance: Provides strong protections for gig workers in California regarding deactivation rights and appeal processes.""",
                "tags": ["california", "ab5", "worker rights", "classification", "deactivation", "appeal rights"]
            },
            {
                "id": "ca-prop22",
                "title": "California Proposition 22",
                "category": "State Laws",
                "state": "California",
                "platform": "Uber, Lyft, DoorDash, Instacart",
                "content": """Proposition 22 (2020) exempts app-based drivers from AB5 but provides specific protections.
                Key Points:
                - Guarantees minimum earnings
                - Healthcare stipends for qualifying drivers
                - Occupational accident insurance
                - Anti-discrimination and sexual harassment policies
                - Right to transparency in deactivation decisions
                - Appeal process required before permanent deactivation
                
                Platforms Covered: Uber, Lyft, DoorDash, Instacart, Postmates
                Relevance: Balances flexibility with worker protections specific to rideshare and delivery platforms.""",
                "tags": ["california", "prop 22", "rideshare", "delivery", "deactivation rights", "transparency"]
            },
            {
                "id": "wa-seattle-gig",
                "title": "Seattle Gig Worker Protections",
                "category": "State Laws",
                "state": "Washington",
                "platform": "All",
                "content": """Seattle Gig Worker Protections (2025) and PayUp Act provide comprehensive rights.
                Key Points:
                - Platforms must provide specific reason for deactivation
                - Right to appeal with evidence submission
                - Cannot be deactivated without warning for first offense (most cases)
                - Required waiting period before permanent deactivation
                - Minimum pay standards
                - Transparency in rating and ranking systems
                
                Relevance: Strong protections requiring clear communication and fair appeal processes.""",
                "tags": ["washington", "seattle", "payup act", "deactivation", "appeal process", "transparency"]
            },
            {
                "id": "ny-gig-rights",
                "title": "NYC Gig Worker Rights (2023)",
                "category": "State Laws",
                "state": "New York",
                "platform": "All",
                "content": """New York City Gig Worker Rights and Delivery Worker Protection laws.
                Key Points:
                - Right to transparency in deactivation decisions
                - Protection against retaliation for asserting rights
                - Required notice period before deactivation
                - Access to earnings data and trip records
                - Minimum pay for delivery workers
                - Right to use any restroom
                
                Relevance: Protects workers from surprise deactivations and ensures access to information.""",
                "tags": ["new york", "nyc", "delivery workers", "transparency", "deactivation notice", "retaliation"]
            },
            {
                "id": "doordash-deactivation",
                "title": "DoorDash Deactivation Policy",
                "category": "Platform Policies",
                "state": "All",
                "platform": "DoorDash",
                "content": """DoorDash deactivation reasons and appeal process.
                Common Deactivation Reasons:
                - Customer rating below 4.2
                - Completion rate below 80%
                - Contract violations (fraud, safety issues)
                - Multiple customer complaints
                - Background check issues
                
                Appeal Process:
                - Appeal deadline: 7-10 days from deactivation
                - Submit through Dasher app or support portal
                - Include evidence: screenshots, delivery photos, GPS data
                - Human review required in CA, WA, NY
                
                Best Practices: Respond within 48 hours, provide detailed explanation, include supporting documentation.""",
                "tags": ["doordash", "deactivation", "appeal deadline", "rating", "completion rate", "policy"]
            },
            {
                "id": "uber-deactivation",
                "title": "Uber Deactivation Policy",
                "category": "Platform Policies",
                "state": "All",
                "platform": "Uber",
                "content": """Uber driver/delivery deactivation reasons and appeal process.
                Common Deactivation Reasons:
                - Star rating below 4.6 (varies by market)
                - Acceptance rate too low in some markets
                - Cancellation rate too high
                - Safety incidents or complaints
                - Fraudulent activity
                - Background check issues
                
                Appeal Process:
                - Appeal deadline: 30 days but respond quickly
                - Use Uber app Help section
                - Provide trip details, evidence, explanation
                - May require in-person review at Greenlight Hub
                
                State-Specific: CA and NY require detailed explanation and appeal rights.""",
                "tags": ["uber", "deactivation", "rating", "appeal", "safety", "fraud", "greenlight hub"]
            },
            {
                "id": "lyft-deactivation",
                "title": "Lyft Deactivation Policy",
                "category": "Platform Policies",
                "state": "All",
                "platform": "Lyft",
                "content": """Lyft driver deactivation reasons and appeal process.
                Common Deactivation Reasons:
                - Star rating below 4.6-4.8 (market dependent)
                - Acceptance rate too low (varies by market)
                - Cancellation rate above 10%
                - Safety incidents or customer complaints
                - Fraudulent activity or policy violations
                - Failed background check or annual inspection
                - Vehicle does not meet platform standards
                
                Appeal Process:
                - Appeal deadline: 30 days from deactivation
                - Submit through Lyft Driver app or help.lyft.com
                - Include trip logs, evidence, detailed explanation
                - May require in-person Hub visit for serious issues
                - Human review required in California and New York
                
                Key Metrics:
                - Maintain 4.8+ rating in most markets
                - Keep cancellation rate under 10%
                - Accept ride requests when online (some markets)
                
                State-Specific: California Prop 22 requires transparency in deactivation decisions and appeal rights.
                
                Best Practices: Document all trips with screenshots, respond to appeals within 48 hours, maintain professional communication.""",
                "tags": ["lyft", "deactivation", "rating", "cancellation rate", "appeal", "rideshare", "policy"]
            },
            {
                "id": "instacart-deactivation",
                "title": "Instacart Shopper Deactivation Policy",
                "category": "Platform Policies",
                "state": "All",
                "platform": "Instacart",
                "content": """Instacart shopper deactivation reasons and appeal process.
                Common Deactivation Reasons:
                - Customer rating below 4.7
                - Order cancellation rate too high
                - Late deliveries or missing items
                - Fraudulent activity (false purchases, receipt manipulation)
                - Poor shopping quality (wrong items, damaged products)
                - Customer complaints about professionalism
                - Alcohol delivery violations
                
                Appeal Process:
                - Appeal deadline: 10-14 days from deactivation
                - Contact through Shopper app or email to shoppers@instacart.com
                - Provide order history, photos of deliveries, communication records
                - Include explanation of circumstances beyond control
                
                Key Metrics:
                - Maintain 4.7+ average rating
                - Keep cancellation rate low (under 15%)
                - On-time delivery rate above 90%
                - Item accuracy and quality scores
                
                Common Issues:
                - Out-of-stock items (not your fault - document substitutions)
                - Customer address errors
                - Apartment access issues
                - Store supply problems
                
                California/Washington: Additional protections for transparency and appeal rights.
                
                Best Practices: Photo every delivery, communicate proactively about substitutions, keep timestamps of store issues.""",
                "tags": ["instacart", "deactivation", "shopper", "rating", "delivery", "grocery", "appeal", "policy"]
            },
            {
                "id": "amazon-flex-deactivation",
                "title": "Amazon Flex Deactivation Policy",
                "category": "Platform Policies",
                "state": "All",
                "platform": "Amazon Flex",
                "content": """Amazon Flex delivery partner deactivation reasons and appeal process.
                Common Deactivation Reasons:
                - Reliability score below threshold
                - Multiple late deliveries
                - Missed blocks or last-minute forfeit
                - Customer complaints (not received, damaged packages)
                - Package misdelivery or theft
                - Violation of delivery protocols
                - Failed background check
                
                Appeal Process:
                - Appeal deadline: 10 days from deactivation
                - Email amazonflex-appeals@amazon.com
                - Include delivery records, GPS data, photos, block history
                - Provide detailed explanation with supporting evidence
                - Response time varies (3-14 days typically)
                
                Key Metrics:
                - Reliability score (on-time delivery, block completion)
                - Customer feedback rating
                - Delivery success rate
                - Block acceptance and completion
                
                Critical Issues:
                - Late arrivals to warehouse can impact reliability
                - Package scanning errors
                - Photo proof of delivery required
                - Route completion within timeframe
                
                State Protections:
                - California: Transparency in deactivation decisions
                - Washington: Appeal rights and specific reason disclosure
                
                Best Practices: Always photograph deliveries, arrive early to blocks, track all packages carefully, document any app issues or route problems.
                
                Note: Amazon Flex is strict on reliability - multiple late blocks can lead to deactivation even with good delivery ratings.""",
                "tags": ["amazon flex", "deactivation", "reliability", "delivery", "appeal", "blocks", "policy"]
            },
            {
                "id": "appeal-evidence",
                "title": "What Evidence to Include in Appeals",
                "category": "Appeal Strategies",
                "state": "All",
                "platform": "All",
                "content": """Essential evidence for successful gig worker deactivation appeals.
                
                Always Include:
                - Screenshots of platform stats (rating, completion rate, total trips/deliveries)
                - Full deactivation notice with timestamp
                - Account history summary
                - Professional track record highlights
                
                For Rating-Based Deactivations:
                - Customer messages showing positive interactions
                - Delivery/trip completion photos with timestamps
                - GPS/route history proving on-time performance
                - Evidence of circumstances beyond your control
                
                For Fraud/Safety Claims:
                - GPS location data for disputed deliveries
                - Timestamped delivery photos
                - Customer communication records
                - Witness statements if applicable
                
                For Policy Violations:
                - Screenshots showing policy compliance
                - Timeline of events
                - Explanation of misunderstanding
                - Training completion records
                
                Format Tips: Organize chronologically, label clearly, keep professional tone.""",
                "tags": ["evidence", "appeal", "documentation", "proof", "screenshots", "gps", "strategy"]
            },
            {
                "id": "appeal-timeline",
                "title": "Appeal Deadlines by Platform",
                "category": "Appeal Strategies",
                "state": "All",
                "platform": "All",
                "content": """Critical appeal deadlines for major gig platforms.
                
                Platform Deadlines:
                - DoorDash: 7-10 days from deactivation
                - Uber: 30 days (respond within 48-72 hours recommended)
                - Lyft: 30 days
                - Instacart: 10-14 days
                - Amazon Flex: 10 days
                - Grubhub: 14 days
                - Postmates: 7 days
                
                State Extensions:
                - California: May have extended timelines under Prop 22
                - Washington: Platforms must allow reasonable time for evidence gathering
                - New York: Required notice period may extend appeal window
                
                Best Practice: Submit appeal within 48-72 hours of deactivation for maximum impact. Quick response shows professionalism and urgency.
                
                Warning: Missing deadlines usually results in permanent deactivation with no recourse.""",
                "tags": ["deadline", "timeline", "appeal window", "platform specific", "urgent", "time limit"]
            },
            {
                "id": "rating-deactivation",
                "title": "Understanding Rating-Based Deactivations",
                "category": "Common Issues",
                "state": "All",
                "platform": "All",
                "content": """How to handle and appeal rating-based deactivations.
                
                Platform Rating Requirements:
                - DoorDash: 4.2 minimum customer rating
                - Uber: 4.6 minimum (varies by city)
                - Lyft: 4.6-4.8 minimum (market dependent)
                - Instacart: 4.7 minimum
                
                Appeal Strategies:
                - Show total positive deliveries vs negative ratings
                - Identify unfair ratings (customer fraud, issues beyond control)
                - Document circumstances: weather, app issues, customer mistakes
                - Highlight recent improvement trend
                - Emphasize completion rate and professionalism
                
                State Protections:
                - California: Cannot deactivate solely for declining low-paying orders
                - Washington: Must explain specific rating incidents
                - New York: Transparency required in rating calculation
                
                Common Defenses: App glitches, customer address errors, weather delays, items out of stock (Instacart), restaurant delays (delivery apps).""",
                "tags": ["rating", "customer rating", "deactivation", "appeal strategy", "unfair rating", "defense"]
            },
            {
                "id": "fraud-accusations",
                "title": "Defending Against Fraud Accusations",
                "category": "Common Issues",
                "state": "All",
                "platform": "All",
                "content": """How to defend against fraud or theft accusations in gig work.
                
                Common Accusations:
                - Undelivered orders
                - Account sharing
                - GPS manipulation
                - False delivery photos
                - Unauthorized charges
                
                Defense Evidence:
                - GPS location data showing you at delivery location
                - Timestamped delivery photos matching GPS coordinates
                - Customer communication records
                - Delivery completion patterns showing consistency
                - No prior violations or complaints
                
                Key Arguments:
                - Customer may have provided wrong address
                - Photo shows delivery at instructed location
                - GPS proves presence at delivery site
                - Other household member may have taken order
                - App error or glitch occurred
                
                Legal Rights:
                - Right to see specific evidence against you
                - Right to respond to accusations
                - Protection against false claims (varies by state)
                
                Response Tips: Stay professional, provide detailed timeline, include all available proof, request specific incident details from platform.""",
                "tags": ["fraud", "theft accusation", "undelivered", "gps proof", "defense", "false claim"]
            }
        ]
    
    def search(self, query: str, top_k: int = 5, filters: Optional[Dict[str, str]] = None) -> List[Dict[str, Any]]:
        """
        Search knowledge base using Pinecone vector search or keyword fallback.
        """
        if self.use_pinecone:
            return self._vector_search(query, top_k, filters)
        else:
            return self._keyword_search(query, top_k)
    
    def _vector_search(self, query: str, top_k: int = 5, filters: Optional[Dict[str, str]] = None) -> List[Dict[str, Any]]:
        """Semantic search using Pinecone"""
        try:
            # Generate query embedding
            query_embedding = self.encoder.encode(query).tolist()
            
            # Build filter dict for Pinecone
            pinecone_filter = {}
            if filters:
                if filters.get('category'):
                    pinecone_filter['category'] = filters['category']
                if filters.get('state'):
                    pinecone_filter['state'] = filters['state']
                if filters.get('platform'):
                    pinecone_filter['platform'] = {'$eq': filters['platform']}
            
            # Query Pinecone
            results = self.index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True,
                filter=pinecone_filter if pinecone_filter else None
            )
            
            # Format results
            formatted_results = []
            for match in results.matches:
                # Find full document
                full_doc = next((doc for doc in self.documents if doc['id'] == match.id), None)
                if full_doc:
                    formatted_results.append({
                        **full_doc,
                        'relevance_score': round(match.score * 100, 2)  # Convert to percentage
                    })
            
            return formatted_results
            
        except Exception as e:
            print(f"❌ Vector search error: {e}. Falling back to keyword search.")
            return self._keyword_search(query, top_k)
    
    def _keyword_search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Fallback keyword search when Pinecone is unavailable.
        """
        query_lower = query.lower()
        query_words = set(query_lower.split())
        
        # Score each document based on keyword matches
        scored_docs = []
        for doc in self.documents:
            score = 0
            
            # Check title match (high weight)
            if any(word in doc['title'].lower() for word in query_words):
                score += 5
            
            # Check tags match (medium-high weight)
            for tag in doc['tags']:
                if any(word in tag for word in query_words):
                    score += 3
            
            # Check category match
            if any(word in doc['category'].lower() for word in query_words):
                score += 2
            
            # Check content match (lower weight but still important)
            content_lower = doc['content'].lower()
            for word in query_words:
                if word in content_lower:
                    score += 1
            
            # Check state/platform match
            if any(word in doc['state'].lower() for word in query_words):
                score += 4
            if any(word in doc['platform'].lower() for word in query_words):
                score += 4
            
            if score > 0:
                scored_docs.append({
                    **doc,
                    'relevance_score': score
                })
        
        # Sort by score and return top k
        scored_docs.sort(key=lambda x: x['relevance_score'], reverse=True)
        return scored_docs[:top_k]
    
    def get_relevant_context(self, platform: str, state: str, reason: str, top_k: int = 3) -> str:
        """
        Get relevant context for RAG-enhanced appeal generation.
        Returns formatted text with citations.
        """
        # Build search query from appeal details
        query = f"{platform} {state} {reason} deactivation appeal rights policy"
        
        # Search with filters
        results = self.search(query, top_k=top_k, filters={
            'platform': platform,
            'state': state
        })
        
        if not results:
            # Try broader search without filters
            results = self.search(query, top_k=top_k)
        
        # Format context with citations
        context_parts = []
        for i, doc in enumerate(results, 1):
            context_parts.append(
                f"[Source {i}: {doc['title']}]\n"
                f"Category: {doc['category']}\n"
                f"State: {doc['state']} | Platform: {doc['platform']}\n"
                f"Content: {doc['content']}\n"
            )
        
        return "\n---\n".join(context_parts) if context_parts else "No specific policy information found."
    
    def get_all_categories(self) -> List[str]:
        """Get all unique categories"""
        return list(set(doc['category'] for doc in self.documents))
    
    def get_all_states(self) -> List[str]:
        """Get all unique states"""
        states = set()
        for doc in self.documents:
            if doc['state'] != 'All':
                states.add(doc['state'])
        return sorted(list(states))
    
    def get_all_platforms(self) -> List[str]:
        """Get all unique platforms"""
        platforms = set()
        for doc in self.documents:
            if doc['platform'] != 'All':
                for platform in doc['platform'].split(', '):
                    platforms.add(platform.strip())
        return sorted(list(platforms))
    
    def filter_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Filter documents by category"""
        return [doc for doc in self.documents if doc['category'] == category]
    
    def filter_by_state(self, state: str) -> List[Dict[str, Any]]:
        """Filter documents by state"""
        return [doc for doc in self.documents if doc['state'] == state or doc['state'] == 'All']
    
    def filter_by_platform(self, platform: str) -> List[Dict[str, Any]]:
        """Filter documents by platform"""
        return [doc for doc in self.documents if platform in doc['platform'] or doc['platform'] == 'All']

# Create singleton instance
knowledge_base_service = KnowledgeBaseService()
