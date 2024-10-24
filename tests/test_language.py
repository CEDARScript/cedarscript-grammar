from cedarscript_grammar import language


def test_language_loading():
    """Test that the language can be loaded successfully"""
    assert language().name == "CEDARScript"


def test_language_singleton():
    """Test that multiple calls return the same language instance"""
    lang1 = language()
    lang2 = language()
    assert lang1 is lang2
