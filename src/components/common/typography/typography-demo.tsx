import { TypographyBlockquote } from './typography-blockquote'
import { TypographyH1 } from './typography-h1'
import { TypographyH2 } from './typography-h2'
import { TypographyH3 } from './typography-h3'
import { TypographyH4 } from './typography-h4'
import { TypographyInlineCode } from './typography-inline-code'
import { TypographyLarge } from './typography-large'
import { TypographyLead } from './typography-lead'
import { TypographyList } from './typography-list'
import { TypographyMuted } from './typography-muted'
import { TypographyP } from './typography-p'
import { TypographySmall } from './typography-small'
import { TypographyTable } from './typography-table'

export function TypographyDemo() {
  return (
    <div className='space-y-6'>
      <TypographyH1>Taxing Laughter: The Joke Tax Chronicles</TypographyH1>
      <TypographyP>
        Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging
        on his throne. One day, his advisors came to him with a problem: the kingdom was running out
        of money.
      </TypographyP>
      <TypographyH2>The King's Plan</TypographyH2>
      <TypographyP>
        The king thought long and hard, and finally came up with{' '}
        <TypographyInlineCode>a brilliant plan</TypographyInlineCode>: he would tax the jokes in the
        kingdom.
      </TypographyP>
      <TypographyBlockquote>
        "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay
        for the privilege."
      </TypographyBlockquote>
      <TypographyH3>The Joke Tax</TypographyH3>
      <TypographyP>
        The king's subjects were not amused. They grumbled and complained, but the king was firm:
      </TypographyP>
      <TypographyList>
        <li>1st level of puns: 5 gold coins</li>
        <li>2nd level of puns: 10 gold coins</li>
        <li>3rd level of puns: 20 gold coins</li>
      </TypographyList>
      <TypographyP>
        As a result, people stopped telling jokes, and the kingdom fell into a gloom. But there is a
        twist in the story...
      </TypographyP>
      <TypographyTable>
        <thead>
          <tr>
            <th>King's Treasury</th>
            <th>People's happiness</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Empty</td>
            <td>Euphoria</td>
          </tr>
        </tbody>
      </TypographyTable>
      <TypographyP>
        And they lived <TypographyInlineCode>happily</TypographyInlineCode> ever after. The end.
      </TypographyP>
    </div>
  )
}
