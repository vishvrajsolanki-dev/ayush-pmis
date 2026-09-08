# Phase 7 B — Job registry / config loader (sequential; depends A)
# Config validation; disable/enable; cycle targeting

def load_config(path_or_dict):
    # Validate required fields: cycle_type, operation, config_key, enabled
    return {"enabled": True, "cycle_target": None, "operation": None}
