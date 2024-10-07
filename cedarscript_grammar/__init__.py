import logging
import sys
from pathlib import Path

from tree_sitter import Language

__version__ = "0.0.6"
__all__ = ("language",)

_ROOT_DIR = Path(__file__).parent


# Explicitly cast to str as tree_sitter.Language.build expects str
_SHARED_LIB_PATH = str((_ROOT_DIR / "cedarscript.so").absolute())


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

    # Explicitly cast to str as tree_sitter.Language.build expects str
    cedar_language_path = str((_ROOT_DIR / lib_name).absolute())
    # cedar_language_path = os.path.abspath(os.path.join(_ROOT_DIR, lib_name))
    logger.warning(f"[{__name__}] Loading native CEDARScript parsing library from {cedar_language_path}")
    return Language(cedar_language_path, "CEDARScript")
