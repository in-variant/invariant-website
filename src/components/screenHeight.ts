/** The height of the screen with the browser's own chrome showing.
 *
 * This is the `svh` unit, and it is the unit the homepage stylesheet sizes its
 * sticky stages in. It is deliberately not `window.innerHeight`: on a phone that
 * is the height right now, which grows as the address bar retracts and shrinks
 * again as it returns. Measuring a CSS box against a number from the other unit
 * left the sticky sections hanging on a one pixel margin.
 *
 * Browsers without `svh` report 0, which reads as "no room" and leaves the
 * sections in their plain, unpinned layout.
 */
export function smallViewportHeight(host: HTMLElement = document.body) {
  const probe = document.createElement('div')
  probe.setAttribute('aria-hidden', 'true')
  probe.style.cssText = 'position:absolute;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none'
  host.appendChild(probe)
  const height = probe.getBoundingClientRect().height
  probe.remove()
  return height
}
