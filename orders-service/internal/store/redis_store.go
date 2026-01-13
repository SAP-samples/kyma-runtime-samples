package store

import (
	"context"

	"github.com/go-redis/redis/v8"
)

type Redis struct {
	client *redis.Client
}

func NewRedis(client *redis.Client) *Redis {
	return &Redis{
		client: client,
	}
}

func (m *Redis) Add(ctx context.Context, key, value string) error {
	if m.client.Get(ctx, key).Err() == nil {
		return AlreadyExistsError
	}
	return m.client.Set(ctx, key, value, 0).Err()
}

func (m *Redis) Get(ctx context.Context, key string) (string, error) {
	value, err := m.client.Get(ctx, key).Result()
	if err == redis.Nil {
		return "", NotFoundError
	}
	return value, err
}

func (m *Redis) Keys(ctx context.Context, pattern string) ([]string, error) {
	return m.client.Keys(ctx, pattern).Result()
}

func (m *Redis) Delete(ctx context.Context, key string) error {
	if m.client.Get(ctx, key).Err() == redis.Nil {
		return NotFoundError
	}
	return m.client.Del(ctx, key).Err()
}

func (m *Redis) Clear(ctx context.Context) error {
	if err := m.client.FlushDB(ctx).Err(); err != redis.Nil {
		return err
	}
	return nil
}

func (m *Redis) GetStoreType(ctx context.Context) string {
	return "REDIS"
}
