{{/*
Expand the name of the chart.
*/}}
{{- define "api-mssql-go.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "api-mssql-go.fullname" -}}
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
{{- define "api-mssql-go.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "api-mssql-go.labels" -}}
helm.sh/chart: {{ include "api-mssql-go.chart" . }}
{{ include "api-mssql-go.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "api-mssql-go.selectorLabels" -}}
app.kubernetes.io/name: {{ include "api-mssql-go.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Database Service host URL.
*/}}
{{- define "api-mssql-go.dbhost" -}}
{{ $subchartname := index .Values "database-mssql" "nameOverride"  }}
{{- printf "%s-%s.%s.%s" .Release.Name $subchartname .Release.Namespace "svc.cluster.local" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Database Secret secretname
*/}}
{{- define "api-mssql-go.secretname" -}}
{{ $subchartname := index .Values "database-mssql" "nameOverride"  }}
{{- printf "%s-%s" .Release.Name $subchartname | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

