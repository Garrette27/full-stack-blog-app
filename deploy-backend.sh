#!/bin/bash

# Deploy backend with JWT_SECRET environment variable
gcloud run deploy blog-backend-1058054107417 \
  --source=backend/ \
  --region=asia-east1 \
  --set-env-vars="JWT_SECRET=my-super-secret-jwt-key-2025,DATABASE_URL=mongodb+srv://erikaprianes27:Lapport2711@garet.96jlm.mongodb.net/blog?retryWrites=true&w=majority" \
  --allow-unauthenticated

echo "Backend deployed with JWT_SECRET environment variable"

