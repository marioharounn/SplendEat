from sys import _getframe
from itertools import count

# Turn this on for debugging serialization loops
DEBUG_SERIALIZERS = False

# https://stackoverflow.com/questions/34115298/how-do-i-get-the-current-depth-of-the-python-interpreter-stack
def stack_size4b(size_hint=8):
    """Get stack size for caller's frame.
    """
    _getframe
    frame = None
    try:
        while True:
            frame = _getframe(size_hint)
            size_hint *= 2
    except ValueError:
        if frame:
            size_hint //= 2
        else:
            while not frame:
                size_hint = max(2, size_hint // 2)
                try:
                    frame = _getframe(size_hint)
                except ValueError:
                    continue

    for size in count(size_hint):
        frame = frame.f_back
        if not frame:
            return size

def debug_field(func):
  def wrapper(*args):
    print(f'[DEBUG {stack_size4b()}]: \033[36m{args[0].__class__.__name__}\033[0m.\033[32m{func.__name__}\033[0m() [\033[31m{args[1]}\033[0m]')
    return func(*args)
  return wrapper