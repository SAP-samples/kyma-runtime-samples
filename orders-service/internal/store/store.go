package store

import (
	"context"
	"errors"
)

type Store interface {
	Add(ctx context.Context, key, value string) error
	Get(ctx context.Context, key string) (string, error)
	Keys(ctx context.Context, pattern string) ([]string, error)
	Delete(ctx context.Context, key string) error
	Clear(ctx context.Context) error
	GetStoreType(ctx context.Context) string
}

var (
	NotFoundError      = errors.New("object not found")
	AlreadyExistsError = errors.New("object already exists")
)
