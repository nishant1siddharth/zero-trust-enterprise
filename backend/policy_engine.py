import json
import os
import re
from typing import Dict, Any

class PolicyEngine:
    def __init__(self, policy_file: str = "policies.json"):
        self.policies = []
        policy_path = os.path.join(os.path.dirname(__file__), policy_file)
        if os.path.exists(policy_path):
            with open(policy_path, "r") as f:
                self.policies = json.load(f)

    def evaluate(self, user_role: str, resource: str, action: str, mfa_enabled: bool) -> Dict[str, Any]:
        """
        Evaluate a request against the policies.
        Returns a dict with 'decision' (ALLOW/DENY) and 'reason'.
        """
        # Implicit Deny by default
        final_decision = "DENY"
        reason = "Implicit Deny: No matching policy found"

        # MFA check - if MFA is not enabled, we highly restrict access to sensitive routes
        if not mfa_enabled and (resource.startswith("/admin") or resource.startswith("/finance")):
            return {"decision": "DENY", "reason": "MFA required for sensitive resources"}
        for policy in self.policies:
            # Check Role Match
            if policy["role"] != user_role and policy["role"] != "*":
                continue
                
            # Check Action Match
            if policy["action"] != action and policy["action"] != "*":
                continue
                
            # Check Resource Match (handle wildcard paths like /hr*)
            resource_pattern = policy["resource"].replace("*", ".*")
            if not re.match(f"^{resource_pattern}$", resource):
                continue

            # We found a matching policy!
            final_decision = policy["decision"]
            reason = f"Policy matched: Role={policy['role']}, Resource={policy['resource']}"
            
            # Explicit DENY overrides ALLOW if multiple match, so we break if DENY
            if final_decision == "DENY":
                break

        return {"decision": final_decision, "reason": reason}

# Global Singleton
policy_engine = PolicyEngine()
