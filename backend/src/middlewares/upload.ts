import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config';
import { AppError } from './errorHandler';
import { Request } from 'express';

// Créer le dossier d'upload si absent
const ensureDir = (dir: string) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Storage pour les fichiers audio (podcasts)
const audioStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const dir = path.join(config.uploadDir, 'audio');
        ensureDir(dir);
        cb(null, dir);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `podcast-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
        cb(null, name);
    },
});

// Storage pour les images
const imageStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const dir = path.join(config.uploadDir, 'images');
        ensureDir(dir);
        cb(null, dir);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `img-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
        cb(null, name);
    },
});

// Filtre images
const imageFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Seuls les formats JPEG, PNG, WebP et GIF sont acceptés', 400));
    }
};

// Filtre audio
const audioFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mp4'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Seuls les formats MP3, WAV, OGG sont acceptés', 400));
    }
};

export const uploadImage = multer({
    storage: imageStorage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const uploadAudio = multer({
    storage: audioStorage,
    fileFilter: audioFilter,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

// Upload en mémoire (pour le scanner IA)
export const uploadMemory = multer({
    storage: multer.memoryStorage(),
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
