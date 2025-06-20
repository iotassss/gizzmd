package domain

import "errors"

var (
	ErrValidationFailed = errors.New("validation failed")
	ErrEntityNotFound   = errors.New("entity not found")
	ErrIDAlreadySet     = errors.New("ID is already set and cannot be changed")
	ErrUnknown          = errors.New("unknown error")
)
