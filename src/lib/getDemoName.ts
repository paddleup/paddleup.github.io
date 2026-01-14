export const getDemoName = (playerId: string): string | undefined => {
  // map with id as key and demo names as values
  const demoNames: Record<string, string> = {
    EeI9ewBfoKpSajmerLDH: 'John Doe',
    GqsPoUKXTw3kJMSJqwU0: 'Jane Smith',
    RGq6NFnJfWIcvQqdifLt: 'Alex Johnson',
    T28AtFw8KdQU23bXrGKh: 'Rock Star',
    TMUWdVphOwXWWpBD0tg4: 'Michael Lee',
    W3tjD6JMTZvL7h9DBekb: 'Sarah Kim',
    bmIXpKlFhwhNuex6mG3a: 'Chris Brown',
    cFbaelu4ZQhUiUovuSDq: 'Hayden Patriquin',
    de634TOQoQt6DcvdllTE: 'David Wilson',
    ev1yGMQ2TwdWVulSScR3: 'Ashley Moore',
    lR41KMImIthFWUlTfvcq: 'Brian Clark',
    ov1yJixQu0Y7GgSVGOS3: 'Olivia Hall',
    s9CKyNz5sETtOI6s9gJb: 'Matthew Young',
    sBaVpfAOMRsqcUiaVdXN: 'Sophia King',
    sewQTUTqabMCEYb80N8L: 'Daniel Wright',
    tgJHqe0ToCymKcHIthmM: 'Megan Scott',
    v8BhDF0WAc6VgcOwc87B: 'Ryan Adams',
    wekFMjCMfuI7MNNVYVnO: 'Lauren Baker',
    zi6ygH5Iais5EPUVR0Ix: 'Kevin Perez',
  };
  return demoNames[playerId];
};
