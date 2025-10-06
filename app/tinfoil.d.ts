declare namespace JSX {
  interface IntrinsicElements {
    'tinfoil-verification-center': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        ref?: React.Ref<any>
        open?: string
        'is-dark-mode'?: string
        mode?: string
        'show-verification-flow'?: string
      },
      HTMLElement
    >
  }
}
