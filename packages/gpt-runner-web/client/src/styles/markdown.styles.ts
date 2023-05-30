import { createGlobalStyle } from 'styled-components'

export const MarkdownStyle = createGlobalStyle`
  .markdown-body {
    line-height: 1.5;
    min-width: 1rem;

    & > *:last-child {
      margin-bottom: 0;
    }

    a {
      color: var(--link-foreground);
    }
    a.absent {
      color: #cc0000;
    }
    a.anchor {
      display: block;
      padding-left: 30px;
      margin-left: -30px;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
    }

    h1, h2, h3, h4, h5, h6 {
      margin: 20px 0 10px;
      padding: 0;
      font-weight: bold;
      -webkit-font-smoothing: antialiased;
      cursor: text;
      position: relative;
    }

    h1:hover a.anchor, h2:hover a.anchor, h3:hover a.anchor, h4:hover a.anchor, h5:hover a.anchor, h6:hover a.anchor {
      text-decoration: none;
    }

    h1 tt, h1 code {
      font-size: inherit;
    }

    h2 tt, h2 code {
      font-size: inherit;
    }

    h3 tt, h3 code {
      font-size: inherit;
    }

    h4 tt, h4 code {
      font-size: inherit;
    }

    h5 tt, h5 code {
      font-size: inherit;
    }

    h6 tt, h6 code {
      font-size: inherit;
    }

    h1 {
      font-size: 28px;
    }

    h2 {
      font-size: 24px;
    }

    h3 {
      font-size: 18px;
    }

    h4 {
      font-size: 16px;
    }

    h5 {
      font-size: 14px;
    }

    h6 {
      font-size: 14px;
    }

    p, blockquote, ul, ol, dl, li, table, pre {
      margin-bottom: 0.5rem;
    }

    hr {
      border: 0 none;
      color: var(--panel-view-border);
      height: 4px;
      padding: 0;

    }

    h2:first-child {
      margin-top: 0;
      padding-top: 0;
    }
    h1:first-child {
      margin-top: 0;
      padding-top: 0;
    }
    h1:first-child + h2 {
      margin-top: 0;
      padding-top: 0;
    }
    h3:first-child, h4:first-child, h5:first-child, h6:first-child {
      margin-top: 0;
      padding-top: 0;
    }

    a:first-child h1, a:first-child h2, a:first-child h3, a:first-child h4, a:first-child h5, a:first-child h6 {
      margin-top: 0;
      padding-top: 0;
    }

    h1 p, h2 p, h3 p, h4 p, h5 p, h6 p {
      margin-top: 0;
    }

    li p.first {
      display: inline-block;
    }
    ul, ol {
      padding-left: 30px;
    }

    ul :first-child, ol :first-child {
      margin-top: 0;
    }

    dl {
      padding: 0;
    }
    dl dt {
      font-size: 14px;
      font-weight: bold;
      font-style: italic;
      padding: 0;
      margin: 15px 0 5px;
    }
    dl dt:first-child {
      padding: 0;
    }
    dl dt > :first-child {
      margin-top: 0;
    }
    dl dt > :last-child {
      margin-bottom: 0;
    }
    dl dd {
      margin: 0 0 15px;
      padding: 0 15px;
    }
    dl dd > :first-child {
      margin-top: 0;
    }
    dl dd > :last-child {
      margin-bottom: 0;
    }

    blockquote {
      border-left: 4px solid var(--panel-view-border);
      padding: 0 15px;
    }
    blockquote > :first-child {
      margin-top: 0;
    }
    blockquote > :last-child {
      margin-bottom: 0;
    }

    table {
      padding: 0;border-collapse: collapse;
    }
    table tr {
      border-top: 1px solid var(--panel-view-border);
      margin: 0;
      padding: 0;
    }
    table tr:nth-child(2n) {
    }
    table tr th {
      font-weight: bold;
      border: 1px solid var(--panel-view-border);
      margin: 0;
      padding: 6px 1rem;
    }
    table tr td {
      border: 1px solid var(--panel-view-border);
      margin: 0;
      padding: 6px 1rem;
    }
    table tr th :first-child, table tr td :first-child {
      margin-top: 0;
    }
    table tr th :last-child, table tr td :last-child {
      margin-bottom: 0;
    }

    img {
      max-width: 100%;
    }

    span.frame {
      display: block;
      overflow: hidden;
    }
    span.frame > span {
      border: 1px solid var(--panel-view-border);
      display: block;
      float: left;
      overflow: hidden;
      margin: 1rem 0 0;
      padding: 7px;
      width: auto;
    }
    span.frame span img {
      display: block;
      float: left;
    }
    span.frame span span {
      clear: both;
      display: block;
      padding: 5px 0 0;
    }
    span.align-center {
      display: block;
      overflow: hidden;
      clear: both;
    }
    span.align-center > span {
      display: block;
      overflow: hidden;
      margin: 1rem auto 0;
      text-align: center;
    }
    span.align-center span img {
      margin: 0 auto;
      text-align: center;
    }
    span.align-right {
      display: block;
      overflow: hidden;
      clear: both;
    }
    span.align-right > span {
      display: block;
      overflow: hidden;
      margin: 1rem 0 0;
      text-align: right;
    }
    span.align-right span img {
      margin: 0;
      text-align: right;
    }
    span.float-left {
      display: block;
      margin-right: 1rem;
      overflow: hidden;
      float: left;
    }
    span.float-left span {
      margin: 1rem 0 0;
    }
    span.float-right {
      display: block;
      margin-left: 1rem;
      overflow: hidden;
      float: right;
    }
    span.float-right > span {
      display: block;
      overflow: hidden;
      margin: 1rem auto 0;
      text-align: right;
    }

    code, tt {
      padding: 0 0.25rem;
      white-space: nowrap;
      background: var(--button-primary-background);
      border-radius: 0.25rem;
      margin: 0 0.25rem;
    }

    pre code {
      padding: unset;
      white-space: pre;
      background: unset;
      border-radius: unset;
      margin: unset;
    }

    sup {
      font-size: 0.83em;
      vertical-align: super;
      line-height: 0;
    }

}
`
