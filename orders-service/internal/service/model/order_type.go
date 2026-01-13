package model

type Order struct {
	Code    string  `json:"orderCode"`
	ConsignmentCode  string  `json:"consignmentCode"`
	ConsignmentStatus  string  `json:"consignmentStatus"`
}
