# Network Segmentation Architecture

## Concept
The Zero Trust Architecture relies heavily on micro-segmentation. In a real enterprise, this is achieved via advanced network firewalls, VLANs, and software-defined networking (SDN). In our simulated environment, we achieve this using **Docker Networks**.

## Network Zones
1. `public_zone`: Contains the Nginx API Gateway and the Frontend React application. This is the only network exposed to the host machine.
2. `identity_zone`: Houses the Authentication service. Internal only.
3. `employee_zone`: Houses the Employee Portal. Internal only.
4. `hr_zone`: Houses the HR service. Internal only.
5. `finance_zone`: Houses the Finance service. Internal only.
6. `admin_zone`: Houses the Admin service. Internal only.

## Isolation Proof
- The `hr_service` container **cannot** ping or send HTTP requests to the `finance_service` container because they do not share a Docker bridge network.
- The only way traffic reaches these services is by traversing the `api_gateway`, which ensures all incoming traffic is appropriately vetted at the edge.
- Once traffic reaches a microservice, the FastAPI application invokes the **Policy Enforcement Point (PEP)**, which consults the **Policy Decision Point (PDP)** to verify the user's role and requested resource before executing the function.

This demonstrates true defense-in-depth: Even if an attacker somehow breached the `employee_service` container, they could not pivot laterally at the network level to attack the `finance_service`.
