# API

```
# First message on joining

{ "type": "join", "roomId": <> }

# Subsequent messages to broadcast to room

{ "type": "event", "roomId": <>, "message": <> }

# TBD remove roomId requirement for all messages
```
