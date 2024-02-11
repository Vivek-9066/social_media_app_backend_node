import {db} from '../connect.js'
import jsonwebtoken from 'jsonwebtoken'

export const getRelationships = (req,res) =>{

        const q = "SELECT followerUserId FROM relatonships WHERE followedUserId = ?";
    db.query(q, [req.query.followedUserId],(err, data) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json(data.map(relationships=>relationships.followerUserId));
    });
};

export const addRelationships = (req,res) => {
    
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Logged in!")

    jsonwebtoken.verify(token,"secretkey", (err, userInfo) =>{
        if(err) return res.status(403).json("Token is not valid")

        const q = "INSERT INTO relatonships (`followerUserId`,`followedUserId`) VALUES (?)";
        const values = [
            userInfo.id,
            req.body.userId, 
        ]

    db.query(q, [values],(err, data) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json("Following");
    });
});

}

export const deleteRelationships = (req,res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Logged in!")

    jsonwebtoken.verify(token,"secretkey", (err, userInfo) =>{
        if(err) return res.status(403).json("Token is not valid")

        const q = "DELETE FROM relatonships WHERE `followerUserId`= ? AND `followedUserId`= ?";

    db.query(q, [userInfo.id, req.query.userId],(err, data) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json("Unfolllow");
    });
});
}