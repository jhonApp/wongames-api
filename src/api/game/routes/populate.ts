// src/api/game/routes/game.js
export default {
    routes: [
      {
        method: "POST",
        path: "/games/populate",
        handler: "game.populate",
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  