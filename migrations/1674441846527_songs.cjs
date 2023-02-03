/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    title: {
      type: 'TEXT',
      notNull: true
    },
    year: {
      type: 'INTEGER',
      notNull: true
    },
    performer: {
      type: 'TEXT',
      notNull: true
    },
    genre: {
      type: 'TEXT',
      notNull: true
    },
    duration: {
      type: 'INTEGER'
    },
    album_id: {
      type: 'TEXT'
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('songs')
}
