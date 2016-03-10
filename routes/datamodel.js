var Sequelize = require('sequelize');

var sequelize = new Sequelize('twitter', 'root', '', {
	  host: 'localhost',
	  dialect: 'mysql',

	  pool: {
	    max: 5,
	    min: 0,
	    idle: 10000
	  },
});

module.exports.Users = sequelize.define('users',{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			allowNull: false
		},
		fname: {
			type: Sequelize.STRING,
		},
		lname: {
			type: Sequelize.STRING,
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true
		},
		pass: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		bday: {
			type: Sequelize.DATEONLY,
		},
		twit_handle: {
			type: Sequelize.STRING,
			unique: true
		},
		contact: {
			type: Sequelize.STRING,
		},
		location: {
			type: Sequelize.STRING,
		}
	},{
		timestamps: true,
		freezeTableName: true,
		tableName: 'users'
	}
)

exports.Sessions = sequelize.define('sessions',{
	session_id: {
		type: Sequelize.STRING,
		primaryKey: true
	}
	},{
	timestamps: false,
	freezeTableName: true,
	tableName: 'sessions'
});

exports.sequelize = sequelize;
