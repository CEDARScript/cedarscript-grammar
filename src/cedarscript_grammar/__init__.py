import logging
import platform
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
    match platform.system().casefold():
        case x if x.startswith('darwin'):
            libext = 'dylib'
        case x if x.startswith('linux'):
            libext = 'so'
        case x if x.startswith('win'):
            libext = 'dll'
        case _ as invalid:
            raise OSError(f"Unsupported platform: {invalid}")
    language_path = str((_ROOT_DIR / f'libtree-sitter-cedarscript.{libext}').absolute())
    logger.warning(f"[{__name__}] Loading native CEDARScript parsing lib from {language_path}")
    lang_name = 'CEDARScript'
    language_function = getattr(cdll.LoadLibrary(fspath(language_path)), f"tree_sitter_{lang_name}")
    language_function.restype = c_void_p
    return Language(language_function(), name=lang_name)
