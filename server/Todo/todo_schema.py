def individual_serial(todo) -> dict:
    return {
        "id":str(todo["_id"]),
        "title":todo["title"],
        "completed":todo["completed"],
        "userid":str(todo["userid"])
    }


def list_serial(todos) -> list:
    return[individual_serial(todo) for todo in todos]