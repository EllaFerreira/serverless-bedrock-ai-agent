Common Support Issues

This document is a guide to common issues that are raised by patients through Patient experience team (PTX).

# 1. Order stuck in "Awaiting token" status:
WHY: The order can be stuck in "Awaiting token" status due to the following reasons: 
- The patient profile is missing information, such as address.
- The patient profile is not updated in the system.

## How to resolve:
- Check the patient profile, specially the address section. You can do that search the patient profile by using the patient code in the database.
- If the patient profile is missing information, such as address, you should update the patient profile in the system before action in the order.


# 2. Revert patient discharged:
## Purpose:

The purpose of this document is to provide explicit instructions for handling patient discharge reversals. This guide details the scenarios in which a discharge can be reverted and cannot be reverted, outlining specific checks that must be performed.

## Allowed Reasons for Reversion:
• Discharges that are due to reasons such as human error or patient request can be reverted.
• Ensure the patient discharge reason does not match "Medical condition" before proceeding with any changes.

## Conditions for Reverting a Discharge:

1. Verify Patient Active Status and Discharge Reason:
• Check if the patient is currently marked as inactive (e.g., active: 0). Only inactive patients should be considered for discharge reversion. Check if the patient discharge reason is "Medical condition". If the discharge reason is "Medical condition", the reversion request must be denied.






