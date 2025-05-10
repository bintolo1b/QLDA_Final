export function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

export function stringAvatar(name) {
  if (!name || typeof name !== 'string') {
    return {
      color: '#000000', // fallback color
    };
  }

  const initials = name.split(' ').map(part => part[0]).join('').substring(0, 2).toUpperCase();

  return {
    color: stringToColor(name), // bạn có thể có hàm này riêng để tạo màu
    initials: initials || '?'
  };
}
