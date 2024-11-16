# Proposals

## Current Proposals
1. [Onboarding Capabilities](onboarding-features)
2. [Browser Extension](browser-extension)
3. [Capture External Command Output](capture-external-command-output)
4. [LLM Tool Interface](LLM%20Tool%20Interface)
5. [Model Fine-Tuning](model-fine-tuning)
6. [Tree-Sitter Query Language Integration](tree-sitter-query-language)

## Ideas to explore

- Automatic generation of project structure visualizations
- Integration with version control history for context-aware onboarding
- Customizable onboarding queries for specific project needs


1. [Tree-Sitter query language](https://cycode.com/blog/tips-for-using-tree-sitter-queries/) integration, which could open up many possibilities;
2. [Comby](https://github.com/comby-tools/comby) notation for an alternate syntax to express refactorings on code or data formats;
3. Create a browser extension that allows web-chat interfaces of Large Language Models to tackle larger file changes;
4. Select a model to fine-tune so that it natively understands `CEDARScript`;
5. Provide language extensions that will improve how LLMs interact with other resource types;
6. Explore using it as an **LLM-Tool Interface**;

## Comby Notation

To replace 'failUnlessEqual' with 'assertEqual':
```sql
UPDATE PROJECT
REAFCTOR LANGUAGE "comby" 
WITH PATTERN '''
comby 'failUnlessEqual(:[a],:[b])' 'assertEqual(:[a],:[b])' example.py
'''
```

