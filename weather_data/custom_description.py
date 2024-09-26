import json
import os

weather_data_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(weather_data_dir, "custom_description.json")

with open(json_path, "r", encoding="utf-8") as file:
    descriptions = json.load(file)


def get_custom_description(key, extra):
    if f"{key}{extra}" in descriptions:
        return descriptions[f"{key}{extra}"]
    elif f"{key}0" in descriptions:
        return descriptions[f"{key}0"]
    else:
        return "nulo"  ## TODO(Thiago4532): Usar uma exception seria mais adequado?


__all__ = ["get_custom_description"]
