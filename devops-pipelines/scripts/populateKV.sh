#!/bin/bash

echo "Initializing Key Vault secrets from Azure DevOps variable groups..."
echo "🔐 Only storing sensitive secrets in Key Vault"

# Function to safely set Key Vault secret
set_kv_secret() {
    local secret_name="$1"
    local secret_value="$2"
    local description="$3"
    
    if [ -n "$secret_value" ] && [ "$secret_value" != "" ] && [ "$secret_value" != "null" ]; then
    echo "Setting Key Vault secret: $secret_name"
    az keyvault secret set \
        --vault-name "$KEY_VAULT_NAME" \
        --name "$secret_name" \
        --value "$secret_value" \
        --description "$description" \
        --output none
    
    if [ $? -eq 0 ]; then
        echo "✅ Secret '$secret_name' set successfully"
    else
        echo "❌ Failed to set secret '$secret_name'"
    fi
    else
    echo "⚠️ Skipping '$secret_name' - value is empty or not provided"
    fi
}

echo "📋 Setting storage connection secrets..."

# MDS API Credentials
set_kv_secret "MDSOptions--AccessKey" "$MDS_OPTIONS_ACCESS_KEY" "MDS API access key"


echo "✅ Key Vault secret initialization completed"

# List all secrets that were set (names only, not values)
echo "📋 Current Key Vault secrets:"
az keyvault secret list --vault-name "$KEY_VAULT_NAME" --query "[].name" -o table