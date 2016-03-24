var Sequelize = require('sequelize');

var sequelize = new Sequelize('twitter', 'root', '', {
	  host: 'localhost',
	  dialect: 'mysql',

//	  pool: {
//	    max: 5,
//	    min: 0,
//	    idle: 10000
//	  },
	  pool: false,
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
		tweet_handle: {
			type: Sequelize.STRING,
			unique: true
		},
		contact: {
			type: Sequelize.STRING,
		},
		dp: {
			type: Sequelize.TEXT,
		},
		location: {
			type: Sequelize.STRING,
		}
	},{
		timestamps: true,
		freezeTableName: true,
		tableName: 'users'
	}
);

exports.Tweet = sequelize.define('tweet',{
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		allowNull: false
	},
	user_id: {
		type: Sequelize.INTEGER
	},
	tweet: {
		type: Sequelize.TEXT
	},
	img_url: {
		type: Sequelize.TEXT
	},
	parent_id: {
		type: Sequelize.INTEGER
	}
	},{
	timestamps: true,
	freezeTableName: true,
	tableName: 'tweet'
});

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

exports.Follow = sequelize.define('follow',{
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	following_id: {
		type: Sequelize.INTEGER
	},
	followers_id: {
		type: Sequelize.INTEGER
	}
	},{
	timestamps: false,
	freezeTableName: true,
	tableName: 'follow'
});

exports.Hashtag = sequelize.define('hashtag',{
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	hashtag: {
		type: Sequelize.STRING
	},
	tweet_id: {
		type: Sequelize.INTEGER
	},
	user_id: {
		type: Sequelize.INTEGER
	}
	},{
	timestamps: false,
	freezeTableName: true,
	tableName: 'hashtag'
});

exports.Likes = sequelize.define('likes',{
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	user_id: {
		type: Sequelize.INTEGER,
	},
	tweet_id: {
		type: Sequelize.INTEGER,
	}
	},{
	timestamps: false,
	freezeTableName: true,
	tableName: 'likes'
});

exports.Identity = sequelize.define('identity',{
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	}
	},{
	timestamps: false,
	freezeTableName: true,
	tableName: 'identity'
});
exports.sequelize = sequelize;
