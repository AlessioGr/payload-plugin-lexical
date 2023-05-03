const inProduction = process.env.NODE_ENV === 'production'
const warnDev = inProduction ? 'error' : 'warn'

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript',
    'prettier',
  ],
  ignorePatterns: [
    '.eslintrc.cjs',
    'demo',
    'node_modules',
    'serialize-example',
    'mongodb',
    'src/payload.config.ts',
    'src/server.ts',
    'playwright.config.ts',
    'tailwind.config.js',
    'postcss.config.js',
    'coverage',
    'build',
    'dist',
    '/media',
    'vitest.config.ts',
    'prettier.config.js',
    'commitlint.config.js'
  ],
  overrides: [
  ],
  settings: {
    react: {
      version: 'detect', // Detect react version
    },
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src/'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
      },
    },
    jest: {
      version: 28,
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module', // Allows for the use of imports
    ecmaVersion: "latest",
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'react',
    'import'
  ],
  rules: {
    // Warn but allow console in production
    'no-console': ['warn'],

    /** ***************************************************************
     * Development relaxations.
     *
     * A few things that should be avoided in production, but which
     * are useful for playing around in development.  These will
     * generate an error in production, and a warning in development.
     *************************************************************** */
    // 'max-len': ['off'],
    'no-alert': [warnDev],
    'no-debugger': [warnDev],
    'no-unused-vars': ['off'],
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-restricted-globals': [warnDev],
    'no-constant-condition': [warnDev],
    'react/jsx-props-no-spreading': ['off'],
    'react/jsx-no-useless-fragment': ['off'],
    'react/jsx-no-constructed-context-values': ['warn'],
    'react/react-in-jsx-scope': ['off'],

    /** ***************************************************************
     * Error prevention and best practices.
     *
     * Important rules for avoiding common errors go here.  Many such
     * rules are already covered by the "extends:" configs above, so
     * only extra ones go here.  There are plenty more to choose from
     * that aren't included above -- worth exploring further.
     **************************************************************** */

    // Airbnb makes this an error, but since create-react-app and
    // react-scripts manages many dependencies for us, the simplest thing
    // is to downgrade this to a warning.
    'import/no-extraneous-dependencies': ['warn'],

    // airbnb makes this an error, but having one named export absolutely
    // makes sense in some cases, depending on how the module is consumed
    // (e.g. modules that export named constants -- sometimes there will only
    // be one constant in a given file).
    'import/prefer-default-export': ['off'],

    // custom order of imports split to custom sections.
    // groups array contains all predefined group names. Order can be customized.
    // can be put together in array like parent and sibling
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md#groups-array
    // pathGroups specify rules of custom patterns position, relative to groups. e.g. react* is before builtin imports
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md#pathgroups-array-of-objects
    'import/order': [
      'error',
      {
        groups: ['builtin', ['external', 'internal'], ['parent', 'sibling'], 'unknown', 'index', 'object', 'type'],
        'newlines-between': 'always',
        pathGroups: [
          { pattern: 'react*', group: 'builtin', position: 'before' },
          { pattern: 'payload*/**', group: 'external', position: 'before' },
          { pattern: 'lexical*/**', group: 'external', position: 'before' },
          { pattern: 'lib/**', group: 'parent', position: 'before' },
          { pattern: 'modules/**', group: 'parent', position: 'after' },
          { pattern: 'ui/**', group: 'parent', position: 'after' },
          { pattern: 'styles/**', group: 'parent', position: 'after' }
        ],
        pathGroupsExcludedImportTypes: [],
        alphabetize: {
          order: 'asc', /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */
          caseInsensitive: true /* ignore case. Options: [true, false] */
        }
      }
    ],

    // Feels draconian -- sometimes "if (a) { return x } else { return y }"
    // does a better job of conveying intention.
    'no-else-return': ['off'],

    // Worth discussing?  Prevents use of hoisting (which is good), but I
    // think this rule disallows too many things it shouldn't.  I.e.,
    // there's generally nothing wrong with defining a function whose _body_
    // contains a reference to a variable lower down in the file, but this
    // rule prevents that.
    'no-use-before-define': ['off'],

    // If we could make an exception for arrow functions, I'd say leave
    // this on.  But of the following three, the first contains a potential
    // bug (if myFunc returns a value), the second is correct but unclear
    // (you wouldn't think removing the curly braces would break it) and
    // the third is correct and self-documenting.
    // 1:  useEffect(() => myFunc())
    // 2:  useEffect(() => { myFunc() })
    // 3:  useEffect(() => void myFunc())
    'no-void': ['off'],

    // At the very least, code flagged by this rule is tricky to
    // reason about, and probably warrants close inspection, even if the
    // resolution is just to disable the rule on a case-by-case basis.
    'require-atomic-updates': ['warn'],

    // Allow jsx syntax in .js files.
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],

    // airbnb makes this an error, but seems annoying for now.  Possibly
    // add this back later?  If enabled, prevents things like:
    //   names.map((name, index) => <Name name={name} key={index} />
    // where the component key comes from an array index.
    'react/no-array-index-key': ['off'],

    // airbnb makes this an error, but seems annoying for now.  Eventually
    // add this back.  Requires explicitly setting propTypes on all custom
    // components.
    'react/prop-types': ['off'],
  }
}
