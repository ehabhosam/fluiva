package utils

import (
	"math"
	"math/rand"
	"time"
)

func DeviseAndCeil(value int, totalTime int) int {
	return int(math.Ceil(float64(totalTime) / float64(value)))
}

func GenerateID() string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	timestamp := time.Now().UnixNano()
	random := rand.New(rand.NewSource(timestamp))
	length := 20
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[random.Intn(len(charset))]
	}
	return string(b)
}
