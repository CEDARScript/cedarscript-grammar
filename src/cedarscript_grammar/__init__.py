import logging
import sys
from ctypes import cdll, c_void_p
from os import fspath
from pathlib import Path

from tree_sitter import Language
from ._version import __version__

__all__ = ("language","__version__")

_ROOT_DIR = Path(__file__).parent


def language() -> Language:
    """Load the tree-sitter library for CEDARScript."""

    logger = logging.getLogger(__name__)
    logger.setLevel("DEBUG")

    # Determine the appropriate library file based on the current architecture
    if sys.platform.startswith('darwin'):
        lib_name = 'libtree-sitter-cedar.dylib'
    elif sys.platform.startswith('linux'):
        lib_name = 'libtree-sitter-cedar.so'
    else:
        raise OSError(f"Unsupported platform: {sys.platform}")

    language_path = str((_ROOT_DIR / lib_name).absolute())
    logger.warning(f"[{__name__}] Loading native CEDARScript parsing lib from {language_path}")
    lang_name = 'CEDARScript'
    language_function = getattr(cdll.LoadLibrary(fspath(language_path)), f"tree_sitter_{lang_name}")
    language_function.restype = c_void_p
    return Language(language_function(), name=lang_name)
