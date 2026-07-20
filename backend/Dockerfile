# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM golang:1.21-alpine AS builder

# Install build tools
RUN apk add --no-cache git

WORKDIR /app

# Copy dependency files first for layer caching
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build a statically linked binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-w -s" -o server .

# ─── Stage 2: Run ─────────────────────────────────────────────────────────────
FROM alpine:3.19

# Add CA certificates for HTTPS calls and timezone data
RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

# Copy only the compiled binary from the builder stage
COPY --from=builder /app/server .

# The backend listens on this port (matches PORT env default in main.go)
EXPOSE 5000

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENTRYPOINT ["./server"]
