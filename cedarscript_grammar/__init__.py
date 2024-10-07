import logging
import sys
from pathlib import Path

from tree_sitter import Language

__version__ = "0.0.7"
__all__ = ("language",)

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
    logger.warning(f"[{__name__}] Loading native CEDARScript parsing library from {language_path}")
    return Language(language_path, "CEDARScript")
