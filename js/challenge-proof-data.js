/**
 * IBM Integration Proof Center - Synthetic Data & State Definitions
 * Note: All data contained herein is synthetic and illustrative for concept validation.
 */

const IBM_PROOF_DATA = {
  // ----------------------------------------------------
  // Use Case 1: Make Your Integration Estate Agent-Ready Data
  // (Lead: IBM Integration. Attach: DataPower Interact Gateway, watsonx Orchestrate, IBM Bob, Confluent)
  // ----------------------------------------------------
  devProof: {
    scenarios: [
      {
        id: 'erp-order-api-agent',
        name: 'Expose an ERP Order API to an Agent',
        product: 'IBM Integration + watsonx Orchestrate',
        summary: 'Describe an existing SAP order-status API so a watsonx Orchestrate agent can discover it, understand its inputs and call it correctly.',
        sampleContext: 'An operations agent must answer "where is order ORD-2025-8841?" using an existing SAP S/4HANA order API that today is only consumed by human-built applications.',
        sourceSystem: 'watsonx Orchestrate Agent (natural language request)',
        targetSystem: 'SAP S/4HANA Order OData API via IBM Integration',
        sampleInputPrompt: 'Find the approved tool that returns order status and delivery date for an order ID, explain its required inputs, and call it for ORD-2025-8841. Return the status in one sentence.',
        samplePayload: `{
  "tool": "getOrderStatus",
  "description": "Returns fulfilment status and promised delivery date for a sales order.",
  "input": { "orderId": "ORD-2025-8841" },
  "output": {
    "orderId": "ORD-2025-8841",
    "status": "SHIPPED",
    "promisedDelivery": "2025-05-16",
    "carrier": "NEXT_DAY_PRIORITY"
  }
}`,
        defaultCriteria: ['functional-correctness', 'test-coverage', 'rework-rate', 'maintainability', 'dev-time'],
        metrics: {
          'functional-correctness': { label: 'Agent Task Success', value: '100% of 25 synthetic order questions answered correctly', baseline: 'Agent cannot find or call the order API without hand-built wrappers', status: 'pass' },
          'test-coverage': { label: 'Tool Invocation Test Coverage', value: '92% of input/error paths exercised by agent test harness', baseline: 'Happy-path manual calls only', status: 'pass' },
          'rework-rate': { label: 'Manual Rework Required', value: '2 field descriptions clarified', baseline: 'Custom wrapper code and documentation per agent', status: 'optimal' },
          'maintainability': { label: 'Reuse & Maintainability Index', value: 'High (one governed API description reused by many agents)', baseline: 'Per-agent bespoke connectors', status: 'pass' },
          'dev-time': { label: 'Time to Agent-Ready', value: '< 1 day from existing API to agent-callable tool', baseline: '2-3 weeks of connector development', status: 'optimal' },
          'estimated-cost': { label: 'Estimated Effort Cost Impact', value: 'Illustrative: majority of wrapper effort avoided', baseline: 'Baseline custom integration effort', status: 'optimal' }
        }
      },
      {
        id: 'event-stream-agent',
        name: 'Make Business Events Discoverable to Agents',
        product: 'IBM Integration + Confluent + watsonx Orchestrate',
        summary: 'Describe Kafka event topics and schemas so an agent can understand what happened in the business and react to it.',
        sampleContext: 'Shipment and inventory events already flow through Confluent Kafka topics. An agent needs to explain a delayed shipment using those events without engineers writing a new service.',
        sourceSystem: 'Confluent Kafka Topics (shipment.events, inventory.levels)',
        targetSystem: 'watsonx Orchestrate Agent via IBM Integration',
        sampleInputPrompt: 'List the event topics related to shipment delays, describe each schema in plain language, and summarise the last delay event for carrier NEXT_DAY_PRIORITY.',
        samplePayload: `{
  "topic": "shipment.events",
  "schema": "ShipmentDelayed v2",
  "event": {
    "shipmentId": "SHP-77102",
    "carrier": "NEXT_DAY_PRIORITY",
    "reason": "WEATHER_HOLD",
    "newEta": "2025-05-17T14:00:00Z"
  }
}`,
        defaultCriteria: ['functional-correctness', 'test-coverage', 'rework-rate', 'dev-time'],
        metrics: {
          'functional-correctness': { label: 'Agent Task Success', value: 'Correct event summary on 100% of synthetic delay scenarios', baseline: 'Agent has no awareness of event topics or schemas', status: 'pass' },
          'test-coverage': { label: 'Tool Invocation Test Coverage', value: '88% of schema versions and null-field cases covered', baseline: 'Ad hoc consumer scripts', status: 'pass' },
          'rework-rate': { label: 'Manual Rework Required', value: '1 schema description added', baseline: 'Custom consumer service per use case', status: 'optimal' },
          'maintainability': { label: 'Reuse & Maintainability Index', value: 'High (topic descriptions shared across agents)', baseline: 'Tribal knowledge of topic names', status: 'pass' },
          'dev-time': { label: 'Time to Agent-Ready', value: 'Hours to describe and expose topics', baseline: 'Weeks to build a purpose-built service', status: 'optimal' },
          'estimated-cost': { label: 'Estimated Effort Cost Impact', value: 'Illustrative: reuse of existing streams instead of rebuild', baseline: 'Baseline custom consumer effort', status: 'optimal' }
        }
      },
      {
        id: 'b2b-flow-agent',
        name: 'Let an Agent Use a B2B / EDI Integration Flow',
        product: 'IBM Integration + IBM Bob',
        summary: 'Expose an existing EDI 850 purchase-order flow as an agent-callable capability, and use IBM Bob to accelerate the AI-ready wrapper around it.',
        sampleContext: 'A procurement agent should submit and track purchase orders through an existing trading partner EDI flow without anyone re-implementing the X12 mapping.',
        sourceSystem: 'Procurement Agent (natural language request)',
        targetSystem: 'EDI 850 flow to Trading Partner VAN via IBM Integration',
        sampleInputPrompt: 'Create a purchase order for 50 units of SKU-88219 with supplier PARTNERA using the approved EDI purchase-order flow, then report the acknowledgment status.',
        samplePayload: `ISA*00*          *00*          *ZZ*IBMDEMO        *ZZ*PARTNERA       *250514*1030*U*00401*000000001*0*P*>~
GS*PO*IBMDEMO*PARTNERA*20250514*1030*1*X*004010~
ST*850*0001~
BEG*00*NE*PO-77491**20250514~
PO1*1*50*EA*120.00*PE*BP*SKU-88219~
CTT*1~
SE*5*0001~
GE*1*1~
IEA*1*000000001~`,
        defaultCriteria: ['functional-correctness', 'test-coverage', 'rework-rate', 'maintainability', 'dev-time'],
        metrics: {
          'functional-correctness': { label: 'Agent Task Success', value: 'Valid ANSI X12 850 produced for 100% of synthetic orders', baseline: 'Agents cannot safely produce EDI documents', status: 'pass' },
          'test-coverage': { label: 'Tool Invocation Test Coverage', value: '90% of partner-specific validation rules covered', baseline: 'Manual test files per partner', status: 'pass' },
          'rework-rate': { label: 'Manual Rework Required', value: '1 partner segment override', baseline: 'Re-implementing the mapping for each new channel', status: 'optimal' },
          'maintainability': { label: 'Reuse & Maintainability Index', value: 'High (existing flow reused; wrapper generated with IBM Bob)', baseline: 'Duplicate mappings per consumer', status: 'pass' },
          'dev-time': { label: 'Time to Agent-Ready', value: '< 1 day including IBM Bob-assisted wrapper', baseline: '2-3 weeks to rebuild for agent use', status: 'optimal' },
          'estimated-cost': { label: 'Estimated Effort Cost Impact', value: 'Illustrative: existing mapping reused as-is', baseline: 'Baseline rebuild effort', status: 'optimal' }
        }
      },
      {
        id: 'legacy-service-agent',
        name: 'Make a Legacy SOAP Service Agent-Accessible',
        product: 'IBM Integration + IBM Bob',
        summary: 'Wrap a legacy SOAP order service with a described REST/OpenAPI interface so agents can discover and use it, accelerated by IBM Bob.',
        sampleContext: 'A legacy order fulfilment SOAP service holds valuable business logic but has no machine-readable description an agent can reason about.',
        sourceSystem: 'Legacy WSDL / SOAP Order Service',
        targetSystem: 'OpenAPI 3.0 description exposed through IBM Integration',
        sampleInputPrompt: 'Analyse this legacy SOAP order service, generate an OpenAPI 3.0 description with plain-language operation summaries, and list the fields an agent must supply.',
        samplePayload: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ord="http://ibm.com/orders/v1">
   <soapenv:Body>
      <ord:SubmitLegacyOrder>
         <ord:Header customerRef="CUST-411" region="EMEA"/>
         <ord:LineItems count="2">
            <ord:Item id="ITM-991" quantity="5" rate="110.00"/>
            <ord:Item id="ITM-992" quantity="1" rate="450.00"/>
         </ord:LineItems>
      </ord:SubmitLegacyOrder>
   </soapenv:Body>
</soapenv:Envelope>`,
        defaultCriteria: ['functional-correctness', 'test-coverage', 'rework-rate', 'maintainability', 'dev-time'],
        metrics: {
          'functional-correctness': { label: 'Agent Task Success', value: 'Agent submits valid legacy orders in 100% of synthetic cases', baseline: 'Agent cannot interpret WSDL/XML without manual translation', status: 'pass' },
          'test-coverage': { label: 'Tool Invocation Test Coverage', value: '91% regression coverage against legacy behavior', baseline: 'Incomplete or missing legacy tests', status: 'pass' },
          'rework-rate': { label: 'Manual Rework Required', value: '3 business-rule descriptions refined by SME', baseline: 'Full rewrite of the service for agent use', status: 'optimal' },
          'maintainability': { label: 'Reuse & Maintainability Index', value: 'High (legacy logic reused behind a described API)', baseline: 'Opaque SOAP/XML interface', status: 'pass' },
          'dev-time': { label: 'Time to Agent-Ready', value: 'Hours with IBM Bob assistance', baseline: '3-4 weeks manual migration', status: 'optimal' },
          'estimated-cost': { label: 'Estimated Effort Cost Impact', value: 'Illustrative: logic reused rather than rewritten', baseline: 'Baseline consultant migration effort', status: 'optimal' }
        }
      }
    ],
    allCriteria: [
      { id: 'functional-correctness', name: 'Agent Task Success', desc: 'Validates that the agent finds the right capability, supplies correct inputs and completes the business task without runtime errors.' },
      { id: 'test-coverage', name: 'Tool Invocation Test Coverage', desc: 'Measures automated agent test cases covering edge conditions (nulls, boundary limits, timeouts, malformed responses) and pass rates.' },
      { id: 'rework-rate', name: 'Manual Rework Required', desc: 'Quantifies manual adjustments (descriptions, schemas, mappings) needed before the capability is reliably usable by agents.' },
      { id: 'maintainability', name: 'Reuse & Maintainability', desc: 'Assesses whether existing integrations are reused as-is, shared across agents, and kept consistent with team governance standards.' },
      { id: 'dev-time', name: 'Time to Agent-Ready', desc: 'Tracks elapsed time from an existing integration asset to a capability an agent can discover and use.' },
      { id: 'estimated-cost', name: 'Estimated Cost Impact', desc: 'Evaluates projected engineering effort avoided by reusing existing capabilities compared to building bespoke agent connectors.' }
    ]
  },

  // ----------------------------------------------------
  // Use Case 2: Unify Your Integration Foundation for AI Data
  // (Lead: IBM Integration. Attach: IBM Bob, watsonx Orchestrate, DataPower Interact Gateway, Confluent)
  // ----------------------------------------------------
  modernizationAssessment: {
    profiles: [
      {
        id: 'global-supply-chain',
        name: 'Global Supply Chain & Logistics (High EDI & Hybrid Integration)',
        estateSummary: 'A multi-brand enterprise running 3 legacy middleware brokers, 180+ trading partner EDI connections, and hybrid cloud endpoints.',
        totalIntegrations: 342,
        categories: {
          appApi: 124,
          b2bEdi: 142,
          mft: 48,
          events: 28
        },
        inventory: [
          { name: 'SAP S/4HANA Order Sync', category: 'Application & API', protocol: 'OData / REST', volume: '1.2M msgs/day', complexity: 'High', reuse: 'High (Standard BAPI)', modernizationPriority: 'Wave 1 (Modernize)' },
          { name: 'Tier-1 Supplier EDI 850/856/810', category: 'B2B & EDI', protocol: 'AS2 / X12 5010', volume: '450k docs/day', complexity: 'High', reuse: 'Medium (Partner Custom)', modernizationPriority: 'Wave 2 (Consolidate)' },
          { name: 'Global Warehouse MFT Batch', category: 'Managed File Transfer', protocol: 'SFTP / PGP Batch', volume: '85 GB/day', complexity: 'Medium', reuse: 'High (Standardized MFT)', modernizationPriority: 'Wave 1 (SaaS Migrate)' },
          { name: 'Carrier Telemetry Stream', category: 'Events & Messaging', protocol: 'Kafka / MQTT', volume: '8.4M events/day', complexity: 'Medium', reuse: 'High (Event Schema)', modernizationPriority: 'Wave 3 (Optimize)' },
          { name: 'Legacy Mainframe Inventory MQ', category: 'Application & API', protocol: 'IBM MQ / CICS', volume: '3.8M msgs/day', complexity: 'Critical', reuse: 'Retain Core Gateway', modernizationPriority: 'Wave 2 (Hybrid Bridge)' },
          { name: 'Customer Portal Order Status', category: 'Application & API', protocol: 'REST / JSON', volume: '620k calls/day', complexity: 'Low', reuse: 'Very High (Public API)', modernizationPriority: 'Wave 1 (Modernize)' }
        ],
        findings: {
          reuseOpportunities: '64% of legacy custom point-to-point mappings share identical canonical fields and can be consolidated into 12 standardized FlowServices.',
          dependencies: 'Mainframe CICS inventory gateway requires non-disruptive hybrid connectivity with zero-downtime SLA during migration.',
          modernizationCandidates: '48 legacy SFTP scheduled cron jobs can be upgraded immediately to cloud-managed event-triggered file transfers.',
          migrationConsiderations: 'Trading partner AS2 certificates and compliance audit logs must be maintained with continuous validation.',
          resilienceScore: 'Current estate has 4 single points of failure across on-prem broker clusters; target architecture introduces active-active containerized resilience.'
        },
        roadmap: [
          { phase: 'Wave 1: Quick Wins & SaaS Migration', timeline: 'Months 1 - 3', scope: 'Standard REST APIs, public endpoints, and cloud MFT migration. Immediate 35% reduction in on-prem broker footprint.' },
          { phase: 'Wave 2: B2B/EDI & Core Business Workloads', timeline: 'Months 4 - 8', scope: 'Consolidate 142 partner EDI pipelines into webMethods B2B Hub with automated partner onboarding.' },
          { phase: 'Wave 3: Event Backbone & Hybrid Governance', timeline: 'Months 9 - 12', scope: 'Complete containerization on Red Hat OpenShift, universal API governance, and sunset legacy brokers.' }
        ]
      },
      {
        id: 'financial-payments',
        name: 'Financial Services & Real-Time Payments (High Security & MQ)',
        estateSummary: 'Regulated banking environment managing core banking transactions, SWIFT / ISO 20022 messaging, and real-time fraud detection pipelines.',
        totalIntegrations: 512,
        categories: {
          appApi: 230,
          b2bEdi: 68,
          mft: 114,
          events: 100
        },
        inventory: [
          { name: 'ISO 20022 Real-Time Payment Engine', category: 'Application & API', protocol: 'REST / XML / JSON', volume: '14.2M tx/day', complexity: 'Critical', reuse: 'High (ISO Standards)', modernizationPriority: 'Wave 1 (Modernize)' },
          { name: 'SWIFT MT to MX Translation Hub', category: 'B2B & EDI', protocol: 'SWIFT Alliance / MQ', volume: '890k msgs/day', complexity: 'Critical', reuse: 'High (Standard Hub)', modernizationPriority: 'Wave 2 (Consolidate)' },
          { name: 'End-of-Day General Ledger MFT', category: 'Managed File Transfer', protocol: 'Connect:Direct / SFTP', volume: '240 GB/day', complexity: 'High', reuse: 'Medium', modernizationPriority: 'Wave 2 (SaaS Migrate)' },
          { name: 'Real-Time Fraud Telemetry Stream', category: 'Events & Messaging', protocol: 'Kafka / Event Streams', volume: '42M events/day', complexity: 'High', reuse: 'High (Topic Mesh)', modernizationPriority: 'Wave 1 (Optimize)' },
          { name: 'Core Banking Account Ledger (Db2)', category: 'Application & API', protocol: 'JDBC / MQ', volume: '22M calls/day', complexity: 'Critical', reuse: 'Retain Core Gateway', modernizationPriority: 'Wave 3 (Hybrid Bridge)' },
          { name: 'Open Banking PSD2 / CFPB API Gateway', category: 'Application & API', protocol: 'mTLS REST OpenAPI', volume: '6.8M calls/day', complexity: 'Medium', reuse: 'High (Public APIs)', modernizationPriority: 'Wave 1 (Modernize)' }
        ],
        findings: {
          reuseOpportunities: 'Over 80 custom XML payment transformation scripts can be unified under a single ISO 20022 canonical data dictionary.',
          dependencies: 'Strict PCI-DSS, SOC2, and FIPS-140-3 HSM encryption requirements across all transit points.',
          modernizationCandidates: 'Legacy batch settlement flows can be shifted to event-driven real-time validation via IBM Event Automation.',
          migrationConsiderations: 'Zero message loss requirement with strict transactional two-phase commit (XA) verification.',
          resilienceScore: '99.999% uptime required; containerized multi-region active-active gateway deployment required.'
        },
        roadmap: [
          { phase: 'Wave 1: Open Banking & High-Speed APIs', timeline: 'Months 1 - 4', scope: 'Standardize API gateway and external partner APIs under unified runtime policy enforcement.' },
          { phase: 'Wave 2: Payment Transformation & MFT Modernization', timeline: 'Months 5 - 9', scope: 'Migrate ISO 20022 and SWIFT transformation flows to cloud-native FlowServices.' },
          { phase: 'Wave 3: Core Transaction Resilience & DR Automation', timeline: 'Months 10 - 14', scope: 'Full multi-region automated failover and modernization of batch file transfers.' }
        ]
      },
      {
        id: 'healthcare-provider',
        name: 'Healthcare & Life Sciences (HL7, FHIR & HIPAA Compliance)',
        estateSummary: 'Regional health network integrating EHR systems (Epic/Cerner), medical imaging PACS transfers, and insurance claims exchanges.',
        totalIntegrations: 218,
        categories: {
          appApi: 94,
          b2bEdi: 52,
          mft: 42,
          events: 30
        },
        inventory: [
          { name: 'EHR FHIR R4 Patient Identity Gateway', category: 'Application & API', protocol: 'SMART on FHIR / REST', volume: '2.1M calls/day', complexity: 'High', reuse: 'Very High (FHIR Standard)', modernizationPriority: 'Wave 1 (Modernize)' },
          { name: 'HIPAA X12 837/835 Claims Clearinghouse', category: 'B2B & EDI', protocol: 'AS2 / X12 EDI', volume: '180k claims/day', complexity: 'High', reuse: 'High (Standard HIPAA)', modernizationPriority: 'Wave 2 (Consolidate)' },
          { name: 'Medical Imaging DICOM/PACS Batch Transfer', category: 'Managed File Transfer', protocol: 'High-speed Aspera / SFTP', volume: '1.4 TB/day', complexity: 'High', reuse: 'High (Aspera Engine)', modernizationPriority: 'Wave 1 (SaaS Migrate)' },
          { name: 'Patient Vitals & ICU Telemetry', category: 'Events & Messaging', protocol: 'MQTT / Kafka', volume: '12M events/day', complexity: 'Critical', reuse: 'Medium', modernizationPriority: 'Wave 2 (Optimize)' },
          { name: 'Legacy Lab Information System (LIS)', category: 'Application & API', protocol: 'HL7 v2.5 / MLLP', volume: '650k msgs/day', complexity: 'Medium', reuse: 'High (HL7-to-FHIR converter)', modernizationPriority: 'Wave 1 (Modernize)' }
        ],
        findings: {
          reuseOpportunities: 'Transform legacy HL7 v2 messages into FHIR R4 resources automatically using pre-built healthcare transformation libraries.',
          dependencies: 'Strict HIPAA BAA, encryption at rest/in transit, and patient de-identification filters.',
          modernizationCandidates: 'Legacy point-to-point MLLP socket interfaces replaced with managed secure API endpoints.',
          migrationConsiderations: 'Clinical continuous operations — patient care integrations cannot suffer maintenance downtime.',
          resilienceScore: 'High requirement for local edge survivability at regional clinic sites.'
        },
        roadmap: [
          { phase: 'Wave 1: FHIR API Gateway & HL7 Modernization', timeline: 'Months 1 - 3', scope: 'Deploy FHIR API layer and automated HL7 v2 to FHIR converters.' },
          { phase: 'Wave 2: Claims Exchange & Aspera PACS Transport', timeline: 'Months 4 - 7', scope: 'Consolidate claims clearinghouse EDI and accelerate medical image transfer.' },
          { phase: 'Wave 3: Real-Time Clinical Event Mesh', timeline: 'Months 8 - 11', scope: 'Streamline ICU device telemetry into unified clinical event backbone.' }
        ]
      }
    ]
  },

  // ----------------------------------------------------
  // Use Case 3: Secure and Govern Enterprise AI Interactions Data
  // (Lead: DataPower Interact Gateway. Attach: IBM Integration, API Connect, watsonx Orchestrate)
  // ----------------------------------------------------
  aiGovProof: {
    scenario: {
      title: 'Investigating a Purchase Order (PO) Exception with a Governed AI Agent (watsonx Orchestrate)',
      description: 'An AI assistant receives a natural language query from an operations manager regarding an invoice discrepancy. It must query the ERP system, verify stock across warehouse systems, and determine remediation—all within strict enterprise guardrails.',
      agentPrompt: 'Supplier invoice #INV-9821 for PO #PO-44102 has a $4,200 freight variance. Investigate root cause, check inventory levels at Memphis DC, and if within authorized policy, re-route replacement shipment from Atlanta DC.'
    },
    policyControls: [
      { id: 'token-auth', name: 'Identity & Token Validation', desc: 'Validates agent OAuth2 / mTLS client certificate and verified IAM roles before granting catalog visibility.', enabled: true },
      { id: 'schema-validation', name: 'Strict Schema & Semantic Guardrails', desc: 'IBM DataPower Interact Gateway enforces request/response JSON schema boundaries on agent, LLM and MCP tool calls to prevent prompt injection payload attacks.', enabled: true },
      { id: 'pii-masking', name: 'Dynamic Data Masking & Tokenization', desc: 'Masks vendor banking numbers, tax identifiers, and customer PII before sending context to LLMs.', enabled: true },
      { id: 'rbac-check', name: 'Least-Privilege RBAC Scope Check', desc: 'Ensures the agent is restricted to authorized tools and cannot call administrative or unapproved APIs.', enabled: true },
      { id: 'approval-gate', name: 'Human-in-the-Loop Approval Threshold', desc: 'Enforces human authorization for actions exceeding financial thresholds (e.g. variances > $1,000 or rerouting).', enabled: true }
    ],
    actionModes: {
      'permitted': {
        title: 'Mode A: Permitted Bounded Action (Read PO & Inventory)',
        description: 'The agent requests read-only inspection of PO #PO-44102, invoice #INV-9821, and inventory levels. The action satisfies all read-scope RBAC policies.',
        badge: 'Status: Approved & Executed',
        badgeType: 'green',
        steps: [
          { time: '10:14:02.102', actor: 'Operations User', action: 'Prompt submitted via Assistant interface', detail: 'Agent prompt received: "Investigate PO #PO-44102 invoice variance..."', status: 'info' },
          { time: '10:14:02.340', actor: 'IBM API Connect', action: 'Approved Tool & MCP Catalog Discovery', detail: 'Discovered approved enterprise tools: GetPurchaseOrderDetails(v2), GetInvoiceVariance(v1), QueryInventoryStock(v3)', status: 'info' },
          { time: '10:14:02.415', actor: 'DataPower Interact Gateway', action: 'Runtime Policy & Scope Check', detail: 'PASSED: Agent identity verified (IAM: agent-ops-read). Token valid. Schema conforms to OpenAPI spec.', status: 'pass' },
          { time: '10:14:02.680', actor: 'ERP & Integration Layer', action: 'Execution: Read Operations', detail: 'Fetched PO #PO-44102 ($42,000) and Invoice #INV-9821 ($46,200). Freight variance confirmed at +$4,200 due to expedited carrier surcharge.', status: 'pass' },
          { time: '10:14:02.820', actor: 'Audit & Compliance Engine', action: 'Immutable Audit Log Recorded', detail: 'Logged transaction TX-99210-A. Policy Rule: POL-READ-SEC-01. Data masking applied to vendor bank info.', status: 'pass' },
          { time: '10:14:02.950', actor: 'AI Agent Response', action: 'Structured Result Presented', detail: 'Root cause identified: Expedited carrier surcharge applied by supplier. Memphis DC currently has 0 units; Atlanta DC has 450 units available.', status: 'complete' }
        ],
        auditPayload: {
          transactionId: 'TX-99210-A',
          timestamp: '2025-05-14T10:14:02.820Z',
          agentId: 'agent-ops-investigator-04',
          clientIp: '10.240.12.88 (VPC Gateway)',
          gateway: 'DataPower Interact Gateway v11.1',
          policyId: 'POL-READ-SEC-01',
          ruleOutcome: 'ALLOW_PERMITTED_SCOPE',
          toolsInvoked: ['GetPurchaseOrderDetails', 'GetInvoiceVariance', 'QueryInventoryStock'],
          dataMaskingApplied: true,
          maskedFields: ['vendorBankAccount', 'taxIdentifier', 'signatureHash'],
          latencyMs: 148
        }
      },
      'approval': {
        title: 'Mode B: Action Requiring Human-in-the-Loop Approval (Reroute / Adjust > $1,000)',
        description: 'The agent determines that fixing the supply outage requires rerouting replacement units from Atlanta DC with a $4,200 budget adjustment. This triggers an automated human authorization gate.',
        badge: 'Status: Approval Gate Triggered (Pending Human Review)',
        badgeType: 'yellow',
        steps: [
          { time: '10:14:02.102', actor: 'Operations User', action: 'Prompt submitted via Assistant interface', detail: 'Agent prompt received: "Investigate PO #PO-44102 and re-route shipment if needed..."', status: 'info' },
          { time: '10:14:02.340', actor: 'IBM API Connect', action: 'Approved Tool & MCP Catalog Discovery', detail: 'Tool requested: TriggerShipmentReroute(v1) with cost adjustment parameter $4,200.00', status: 'info' },
          { time: '10:14:02.450', actor: 'DataPower Interact Gateway', action: 'Policy Rule Evaluation (POL-FIN-THRESH-04)', detail: 'FLAGGED: Action exceeds autonomous financial threshold ($1,000.00). Human supervisor approval MANDATORY.', status: 'warn' },
          { time: '10:14:02.580', actor: 'Workflow Engine', action: 'Human Approval Request Dispatched', detail: 'Generated approval task #APRV-8812 for Operations Lead (role: ops-manager-approval). Execution paused.', status: 'warn' },
          { time: '10:14:02.710', actor: 'Audit & Compliance Engine', action: 'Audit State: AWAITING_AUTHORIZATION', detail: 'Recorded hold event TX-99210-B. Parameters snapshot signed and archived to compliance ledger.', status: 'warn' },
          { time: '10:14:02.850', actor: 'AI Agent Response', action: 'User Acknowledgment', detail: 'Proposed action: Reroute 120 units from Atlanta DC (cost: $4,200). Awaiting supervisor approval before initiating ERP state change.', status: 'pending' }
        ],
        auditPayload: {
          transactionId: 'TX-99210-B',
          timestamp: '2025-05-14T10:14:02.710Z',
          agentId: 'agent-ops-investigator-04',
          clientIp: '10.240.12.88 (VPC Gateway)',
          gateway: 'DataPower Interact Gateway v11.1',
          policyId: 'POL-FIN-THRESH-04',
          ruleOutcome: 'HOLD_REQUIRE_HUMAN_APPROVAL',
          approvalTaskId: 'APRV-8812',
          requiredRole: 'ops-manager-approval',
          toolsInvoked: ['TriggerShipmentReroute [PAUSED]'],
          financialThresholdMax: 1000.00,
          requestedAdjustment: 4200.00,
          latencyMs: 132
        }
      },
      'blocked': {
        title: 'Mode C: Restricted Action Blocked (Unauthorized DB Mutation / Scope Violation)',
        description: 'The agent attempts to execute an unapproved database write or bypass standard ERP business logic. DataPower Interact Gateway immediately blocks the request and generates a security event.',
        badge: 'Status: Request Blocked & Security Alert Dispatched',
        badgeType: 'red',
        steps: [
          { time: '10:14:02.102', actor: 'Operations User', action: 'Prompt submitted via Assistant interface', detail: 'Agent prompt received attempting direct database update of supplier credit terms.', status: 'info' },
          { time: '10:14:02.290', actor: 'IBM API Connect', action: 'Tool Catalog Match Check', detail: 'Target tool: DirectSqlExecute(v1) on core ERP database.', status: 'info' },
          { time: '10:14:02.380', actor: 'DataPower Interact Gateway', action: 'Security Guardrail Intercept', detail: 'BLOCKED: Target tool not in approved catalog whitelist for agent role. Rule: POL-ZERO-TRUST-09.', status: 'fail' },
          { time: '10:14:02.490', actor: 'Security Event Dispatcher', action: 'SIEM Alert Generated', detail: 'Dispatched High-Severity Alert SEC-AGT-UNAUTH to Enterprise SIEM (QRadar / Splunk).', status: 'fail' },
          { time: '10:14:02.620', actor: 'Audit & Compliance Engine', action: 'Tamper-Evident Security Log', detail: 'Logged violation TX-99210-C. Origin IP, prompt hash, and blocked invocation metadata captured.', status: 'fail' },
          { time: '10:14:02.750', actor: 'AI Agent Response', action: 'Secure Failure Message', detail: 'Action refused: Direct database modification violates enterprise integration security policies. Please use governed ERP API channels.', status: 'blocked' }
        ],
        auditPayload: {
          transactionId: 'TX-99210-C',
          timestamp: '2025-05-14T10:14:02.620Z',
          agentId: 'agent-ops-investigator-04',
          clientIp: '10.240.12.88 (VPC Gateway)',
          gateway: 'DataPower Interact Gateway v11.1',
          policyId: 'POL-ZERO-TRUST-09',
          ruleOutcome: 'DENY_SCOPE_VIOLATION',
          attemptedTool: 'DirectSqlExecute (UNAPPROVED)',
          securityAlertSeverity: 'HIGH',
          siemIncidentRef: 'INC-SEC-44120',
          dataExfiltrationRisk: 'PREVENTED',
          latencyMs: 95
        }
      }
    }
  },

  // ----------------------------------------------------
  // Connectors & Ecosystem Catalog Data
  // ----------------------------------------------------
  connectors: [
    { name: 'SAP S/4HANA & ECC', category: 'Enterprise ERP', badge: 'Certified', desc: 'OData, IDoc, BAPI, and RFC native integration with enterprise transaction support.' },
    { name: 'Salesforce CRM & Core', category: 'CRM & Front Office', badge: 'Certified', desc: 'Bi-directional synchronization for Accounts, Opportunities, and Platform Events.' },
    { name: 'ServiceNow ITSM', category: 'IT & Service Ops', badge: 'Popular', desc: 'Automate incident triage, CMDB asset sync, and change requests.' },
    { name: 'Workday HCM & Finance', category: 'HR & Finance', badge: 'Popular', desc: 'Secure worker provisioning, payroll sync, and organizational hierarchy flows.' },
    { name: 'Apache Kafka & Event Streams', category: 'Event & Messaging', badge: 'Certified', desc: 'High-throughput publish/subscribe with schema registry and avro serialization.' },
    { name: 'Oracle ERP Cloud & E-Business', category: 'Enterprise ERP', badge: 'Certified', desc: 'Standard business object adapters with high-volume transaction reliability.' },
    { name: 'Snowflake Data Cloud', category: 'Data & Analytics', badge: 'Popular', desc: 'Stream change data capture and ELT micro-batches directly to data warehouses.' },
    { name: 'Amazon Web Services (S3, SQS)', category: 'Cloud Infrastructure', badge: 'Certified', desc: 'Serverless event triggers, object storage ingestion, and queue integration.' },
    { name: 'Microsoft Azure (Blob, Service Bus)', category: 'Cloud Infrastructure', badge: 'Certified', desc: 'Enterprise hybrid integration with Azure messaging and storage fabric.' },
    { name: 'Google Cloud Platform (BigQuery, Pub/Sub)', category: 'Cloud Infrastructure', badge: 'Certified', desc: 'Real-time telemetry streaming and analytical data ingest.' },
    { name: 'IBM MQ & Mainframe CICS', category: 'Enterprise Messaging', badge: 'Core IBM', desc: 'Mission-critical enterprise message queuing with guaranteed once-and-only-once delivery.' },
    { name: 'AS2 / EDI Trading Partner Hub', category: 'B2B & EDI', badge: 'Core IBM', desc: 'Full support for ANSI X12, EDIFACT, RosettaNet, and Tradacoms standards.' }
  ],

  // ----------------------------------------------------
  // Leadership View Experiment & Measurement Data
  // ----------------------------------------------------
  leadership: {
    hypothesis: 'For qualified IBM Integration prospects (architects, engineering leads, and enterprise modernization decision-makers), an outcome-oriented technical proof reduces decision friction and accelerates qualified pipeline velocity compared to an open-ended generic free trial.',
    experimentDesign: {
      control: {
        name: 'Control (Current Experience)',
        headline: 'Start Free Trial / Book Live Demo',
        mechanism: 'Directs all web visitors into either a sales meeting or a self-service sandbox with open-ended onboarding.',
        challenges: 'Trial fatigue (high abandonment before first flow is built), low conversion from trial-to-sales engagement for high-complexity enterprise buyers.'
      },
      variant: {
        name: 'Experiment Variant (Proof-Led Journey)',
        headline: 'Choose Your Proof Path / Book Live Demo',
        mechanism: 'Presents 3 bounded, outcome-driven proof offers targeting specific evaluation questions before larger commitments.',
        expectedValue: 'Higher intent qualification, clear deliverables, shorter sales cycle to scoped implementation.'
      }
    },
    funnelMetrics: [
      { id: 'selection-rate', name: 'Proof-Path Selection Rate', current: 'Baseline required', target: '28 - 34%', note: 'Percentage of qualified homepage visitors selecting a dedicated proof path' },
      { id: 'eval-start-rate', name: 'Evaluation Start Rate', current: 'Baseline required', target: '65%', note: 'Visitors who complete Step 2 (scenario/scope definition)' },
      { id: 'eval-completion-rate', name: 'Evaluation Completion Rate', current: 'Baseline required', target: '48%', note: 'Visitors who review the full scorecard and click "Discuss Scoped Plan"' },
      { id: 'qual-opp-rate', name: 'Qualified Eval-to-Opportunity', current: 'Baseline required', target: '38%', note: 'Conversion from completed proof request into sales-accepted opportunity (BANT qualified)' },
      { id: 'eval-to-impl', name: 'Eval-to-Scoped Implementation', current: 'Baseline required', target: '24%', note: 'Opportunity conversion into paid pilot, scoped proof-of-value, or subscription' },
      { id: 'cycle-duration', name: 'Average Sales Cycle Duration', current: 'Baseline required', target: '-22% days', note: 'Reduction in days from initial engagement to signed evaluation agreement' },
      { id: 'cost-per-opp', name: 'Cost per Qualified Opportunity (SE Effort)', current: 'Baseline required', target: 'Measurable ROI', note: 'Pre-sales engineering hours spent per qualified opportunity vs open trials' }
    ]
  }
};

if (typeof window !== 'undefined') {
  window.IBM_PROOF_DATA = IBM_PROOF_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IBM_PROOF_DATA;
}
