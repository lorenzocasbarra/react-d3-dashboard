import json
class DictEncoder(json.JSONEncoder):
  def default(self, o):
    return o.__dict__