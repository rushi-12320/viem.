import { expect, test } from 'vitest'

import { poll } from './poll'
import { wait } from './wait'

test('polls on a given interval', async () => {
  let items: string[] = []
  poll(
    async () => {
      items.push('wagmi')
    },
    {
      interval: 100,
    },
  )

  await wait(500)
  expect(items).toMatchInlineSnapshot(`
    [
      "wagmi",
      "wagmi",
      "wagmi",
      "wagmi",
    ]
  `)
})

test('emitOnBegin', async () => {
  let items: string[] = []
  poll(
    async () => {
      items.push('wagmi')
    },
    {
      emitOnBegin: true,
      interval: 100,
    },
  )

  await wait(500)
  expect(items).toMatchInlineSnapshot(`
    [
      "wagmi",
      "wagmi",
      "wagmi",
      "wagmi",
      "wagmi",
    ]
  `)
})

test('initialWaitTime', async () => {
  let items: string[] = []
  poll(
    async () => {
      items.push('wagmi')
    },
    {
      initialWaitTime: async () => 200,
      interval: 100,
    },
  )

  await wait(500)
  expect(items).toMatchInlineSnapshot(`
    [
      "wagmi",
      "wagmi",
      "wagmi",
    ]
  `)
})

test('stop polling', async () => {
  let items: string[] = []
  const stop = poll(
    async () => {
      items.push('wagmi')
    },
    {
      interval: 100,
    },
  )

  await wait(500)
  expect(items).toMatchInlineSnapshot(`
    [
      "wagmi",
      "wagmi",
      "wagmi",
      "wagmi",
    ]
  `)

  stop()

  await wait(500)
  expect(items).toMatchInlineSnapshot(`
    [
      "wagmi",
      "wagmi",
      "wagmi",
      "wagmi",
    ]
  `)
})
