# Git-Attic
-----------

Git-Attic is a simple script to store valuable but currently unused code safely in your repository (like storing in unwated stuff in an attic).
To use git-attic, simply delete all unused code and commit your changes locally. Then run `node git-attic/script.js`
from the root of your repository. This program will store a patch of your commit along with a copy of all changed
files into `_attic` directory at the root of your repo. 

To get back your changes, you can either:

- Apply the patch in reverse direction directly to your repository (OR)

- When applying patch to original repo creates merge conflicts, apply patch in reverse direction to a copy of the files stored within the `context` dir.
  This will bring everything back. 
