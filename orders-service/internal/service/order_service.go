package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/kyma-project/examples/orders-service/internal/service/model"
	"github.com/kyma-project/examples/orders-service/internal/store"
)

type Order struct {
	store store.Store
}

func NewOrders(store store.Store) *Order {
	return &Order{store: store}
}

func (o *Order) Get(ctx context.Context, id string) (*model.Order, error) {
	if id == "" {
		return nil, errors.New("id cannot be empty")
	}

	value, err := o.store.Get(ctx, fmt.Sprintf("order:%s", id))
	if err != nil {
		return nil, err
	}

	return o.toOrder(value)
}

func (o *Order) List(ctx context.Context) ([]model.Order, error) {
	keys, err := o.store.Keys(ctx, "order:*")
	if err != nil {
		return nil, err
	}

	orders := make([]model.Order, 0, len(keys))
	for _, key := range keys {
		value, err := o.store.Get(ctx, key)
		if err != nil {
			return nil, err
		}

		order, err := o.toOrder(value)
		if err != nil {
			return nil, err
		}
		orders = append(orders, *order)
	}

	return orders, nil
}

func (o *Order) Create(ctx context.Context, order *model.Order) error {
	if order == nil || order.Code == "" {
		return errors.New("invalid object")
	}

	bytes, err := json.Marshal(order)
	if err != nil {
		return errors.New("cannot marshal orders")
	}

	return o.store.Add(ctx, fmt.Sprintf("order:%s", order.Code), string(bytes))
}

func (o *Order) DeleteAll(ctx context.Context) error {
	return o.store.Clear(ctx)
}

func (o *Order) DeleteOne(ctx context.Context, id string) error {
	return o.store.Delete(ctx, fmt.Sprintf("order:%s", id))
}

func (o *Order) toOrder(value string) (*model.Order, error) {
	order := new(model.Order)
	err := json.Unmarshal([]byte(value), order)
	if err != nil {
		return nil, errors.New("cannot unmarshal order")
	}

	return order, nil
}

func (o *Order) GetStorageType(ctx context.Context) string {
	return o.store.GetStoreType(ctx)
}
