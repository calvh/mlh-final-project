import random


def get_anon_name(choices, choices_count):
    # returns a randomly chosen name from a given list
    # increments the name in a tracker and appends the count number to the name
    # e.g., dog#1234
    choice = random.choice(choices)
    choices_count[choice] = choices_count.get(choice, 0) + 1
    return f"{choice}#{choices_count[choice]}"
