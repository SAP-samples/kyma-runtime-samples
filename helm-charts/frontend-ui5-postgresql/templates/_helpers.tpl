{{/*
Expand the name of the chart.
*/}}
{{- define "frontend-ui5-mssql.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "frontend-ui5-mssql.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "frontend-ui5-mssql.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "frontend-ui5-mssql.labels" -}}
helm.sh/chart: {{ include "frontend-ui5-mssql.chart" . }}
{{ include "frontend-ui5-mssql.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "frontend-ui5-mssql.selectorLabels" -}}
app.kubernetes.io/name: {{ include "frontend-ui5-mssql.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Database Secret secretname
*/}}
{{- define "frontend-ui5-mssql.apiurl" -}}
{{ $subchartname := index .Values "api-mssql-go" "nameOverride"  }}
{{- printf "https://%s-%s.%s" .Release.Name $subchartname .Values.clusterDomain | quote }}
{{- end }}

