import { Controller } from '../decorators';
import { uploadMultipleImage, uploadSingleImage } from '../utils/uploadImage';
import { Request, Response } from 'express';
import db from '../../prisma';
import checkImageType from '../utils/checkImageType';

//Create an Ad
//Delete an Ad
//Edit an Ad

export default class Ad {
    @Controller()
    public static async create(req: Request, res: Response) {
        const { name, id } = req.user;

        if (!req.files) return res.status(400).json('No files uploaded');
        if (!req.files.image) return res.status(400).json('Upload images of product');
        checkImageType(req);

        const { cloudinaryUrls, cloudinaryResult } = await uploadMultipleImage(req.files.image, name, 'wmhas');
        const ad = await db.ad.create({
            data: {
                userId: id,
                photos: cloudinaryUrls,
                ...req.fields,
            },
        });
        res.status(200).json(ad);
    }

    // public static async update() {}

    // public static async delete() {}

    @Controller()
    public static async viewAll(req: Request, res: Response) {
        const ads = await db.ad.findMany();
        res.status(200).json(ads);
    }

    @Controller()
    public static async myAds(req: Request, res: Response) {
        const ads = await db.ad.findMany({
            where: {
                // userId: req.user.id,
            },
        });
        res.status(200).json(ads);
    }

    //public static async search(){}

    @Controller()
    public static async getOne(req: Request, res: Response) {
        const { id } = req.params;
        const isAuthenticated = !!req.user;
        const ad = await db.ad.findFirst({
            where: { id },
            include: {
                author: {
                    select: {
                        name: true,
                        phoneNumber: true,
                        address: true,
                        city: true,
                        lga: true,
                        state: true,
                    },
                },
                comments: isAuthenticated
                    ? {
                          include: {
                              author: {
                                  // Include the author of the comment
                                  select: {
                                      name: true, // Fetch only the author's name (or add other fields as needed)
                                  },
                              },
                              replies: {
                                  include: {
                                      author: {
                                          // Include the author of the reply
                                          select: {
                                              name: true, // Fetch only the author's name (or other fields)
                                          },
                                      },
                                  },
                              },
                          },
                      }
                    : false,
            },
        });
        if (!ad) return res.status(400).json('Ad not found');

        if (!isAuthenticated) {
            ad.address = 'hidden';
            ad.city = 'hidden';
            ad.lga = 'hidden';
            ad.state = 'hidden';
            ad.author.phoneNumber = 'hidden'; // Replace with "hidden"
            ad.author.email = 'hidden'; // Replace with "hidden"
            ad.author.address = 'hidden'; // Replace with "hidden"
            ad.author.city = 'hidden'; // Replace with "hidden"
            ad.author.lga = 'hidden'; // Replace with "hidden"
            ad.author.state = 'hidden'; // Replace with "hidden"
        }

        //Concatenate address fields
        const fullAddress = `${ad.author.address}, ${ad.author.city}, ${ad.author.lga}, ${ad.author.state}`;

        const flattenedAd = {
            ...ad,
            author: {
                name: ad.author.name,
                address: isAuthenticated ? fullAddress : 'hidden', // Set address based on authentication
            },
            comments: isAuthenticated
                ? ad.comments.map((comment) => ({
                      ...comment,
                      author: comment.author.name, // Flatten author name
                      replies: comment.replies.map((reply) => ({
                          ...reply,
                          author: reply.author.name, // Flatten reply author name
                      })),
                  }))
                : 'hidden',
        };
        res.status(200).json(flattenedAd);
    }

    @Controller()
    public static async createComment(req: Request, res: Response) {
        const { content, adId } = req.body;

        const comment = await db.comment.create({
            data: {
                content,
                adId,
                userId: req.user.id,
            },
        });

        res.status(201).json(comment);
    }

    @Controller()
    public static async createReply(req: Request, res: Response) {
        const { content, commentId } = req.body;

        const reply = await db.reply.create({
            data: {
                content,
                commentId,
                userId: req.user.id,
            },
        });

        res.status(201).json(reply);
    }

    // @Controller()
    // public static async getCommentsByPost(req: Request, res: Response) {
    // }
}
