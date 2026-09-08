import sys, os
sys.path.insert(0, os.path.abspath("."))
# Pre-load alloc_core so module exists before test import
import importlib
importlib.import_module("alloc_core.engine")
