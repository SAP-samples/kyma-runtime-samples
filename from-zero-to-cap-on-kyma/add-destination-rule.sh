# This script generates a DestinationRule YAML for the app router with cookie-based session affinity.
#!/bin/bash
set -e

cat <<EOF
apiVersion: networking.istio.io/v1
kind: DestinationRule
metadata:
  name: "{{ .Release.Name }}-approuter"
spec:
  host: "{{ .Release.Name }}-approuter"
  trafficPolicy:
    loadBalancer:
      consistentHash:
        httpCookie:
          name: KYMA_APP_SESSION_ID
          path: /
          ttl: 0s
EOF