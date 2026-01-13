package store

import (
	"context"
	"path/filepath"
	"sync"
)

type Memory struct {
	store map[string]string
	mutex *sync.RWMutex
}

func NewMemory() *Memory {
	return &Memory{
		store: make(map[string]string),
		mutex: &sync.RWMutex{},
	}
}

func (m *Memory) Add(_ context.Context, key, value string) error {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	if _, ok := m.store[key]; ok {
		return AlreadyExistsError
	}

	m.store[key] = value

	return nil
}

func (m *Memory) Get(_ context.Context, key string) (string, error) {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	if value, ok := m.store[key]; ok {
		return value, nil
	}

	return "", NotFoundError
}

func (m *Memory) Keys(_ context.Context, pattern string) ([]string, error) {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	keys := make([]string, 0, len(m.store))
	for key, _ := range m.store {
		if matched, err := filepath.Match(pattern, key); err != nil {
			return nil, err
		} else if matched {
			keys = append(keys, key)
		}
	}

	return keys, nil
}

func (m *Memory) Delete(_ context.Context, key string) error {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	if _, ok := m.store[key]; !ok {
		return NotFoundError
	}

	delete(m.store, key)
	return nil
}

func (m *Memory) Clear(_ context.Context) error {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	m.store = make(map[string]string)

	return nil
}

func (m *Memory) GetStoreType(ctx context.Context) string {
	return "IN_MEMORY"
}
