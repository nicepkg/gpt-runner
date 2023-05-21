import type { FC } from 'react'
import type { SidebarProps } from '../../components/sidebar'
import { Sidebar } from '../../components/sidebar'

const Chat: FC = () => {
  const sidebar: SidebarProps = {
    topToolbar: {
      title: 'GPT Runner',
      actions: [],
    },
    tree: {
      items: [
        {
          id: '1',
          name: 'aaa',
          path: 'aaa',
          isLeaf: false,
          children: [
            {
              id: '1-1',
              name: 'bbb',
              path: 'aaa/bbb',
              isLeaf: false,
              children: [
                {
                  id: '1-1-1',
                  name: 'ccc',
                  path: 'aaa/bbb/ccc',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
      ],
    },
  }
  return <div>
    <Sidebar {...sidebar}></Sidebar>
  </div>
}

Chat.displayName = 'Chat'

export default Chat
