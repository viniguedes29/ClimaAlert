import json
import os


def load_descriptions(json_path=None):
    if not json_path:
        json_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "custom_description.json"
        )
    try:
        with open(json_path, "r", encoding="utf-8") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        raise ValueError(f"Erro ao carregar descrições: {e}")


descriptions = load_descriptions()


def get_custom_description(key, extra):
    composite_key = f"{key}{extra}"
    fallback_key = f"{key}0"

    if composite_key in descriptions:
        return descriptions[composite_key]
    if fallback_key in descriptions:
        return descriptions[fallback_key]
    raise KeyError(f"Descrição não encontrada para a chave: {key}")


__all__ = ["get_custom_description", "descriptions"]
