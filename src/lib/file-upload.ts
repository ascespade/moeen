import { NextRequest, NextResponse } from "next/server";

import { createHash } from "crypto";
import { extname } from "path";

import { realDB } from "./supabase-real";

// Comprehensive File Upload and Media Management System for Hemam Center

// File types and configurations
export const ALLOWED_FILE_TYPES = {
  images: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
  documents: ["pdf", "doc", "docx", "txt", "rtf"],
  audio: ["mp3", "wav", "ogg", "m4a"],
  video: ["mp4", "avi", "mov", "wmv", "flv"],
  medical: ["dcm", "dicom", "nii", "nifti"], // Medical imaging formats
} as const;

export const MAX_FILE_SIZES = {
  images: 10 * 1024 * 1024, // 10MB
  documents: 50 * 1024 * 1024, // 50MB
  audio: 100 * 1024 * 1024, // 100MB
  video: 500 * 1024 * 1024, // 500MB
  medical: 200 * 1024 * 1024, // 200MB
} as const;

// File metadata interface
export interface FileMetadata {
  id: string;
  originalName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  fileType: "image" | "document" | "audio" | "video" | "medical";
  uploadedBy: string;
  patientId?: string;
  sessionId?: string;
  appointmentId?: string;
  tags: string[];
  description?: string;
  isPublic: boolean;
  isEncrypted: boolean;
  checksum: string;
  uploadedAt: Date;
  expiresAt?: Date;
  downloadCount: number;
  lastAccessedAt?: Date;

// File upload handler class
export class FileUploadHandler {
  private static instance: FileUploadHandler;

  private constructor() {}

  static getInstance(): FileUploadHandler {
    if (!FileUploadHandler.instance) {
      FileUploadHandler.instance = new FileUploadHandler();
    return FileUploadHandler.instance;

  // Validate file
  validateFile(
    file: File,
    allowedTypes: string[],
    maxSize: number,
  ): {
    valid: boolean;
    error?: string;
  } {
    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size ${file.size} exceeds maximum allowed size ${maxSize}`,
      };

    // Check file type
    const fileExtension = extname(file.name).toLowerCase().slice(1);
    if (!allowedTypes.includes(fileExtension)) {
      return {
        valid: false,
        error: `File type .${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
      };

    // Check MIME type
    const allowedMimeTypes = this.getAllowedMimeTypes(allowedTypes);
    if (!allowedMimeTypes.includes(file.type)) {
      return {
        valid: false,
        error: `MIME type ${file.type} is not allowed`,
      };

    return { valid: true };

  // Get allowed MIME types for file extensions
  private getAllowedMimeTypes(extensions: string[]): string[] {
    const mimeTypeMap: Record<string, string[]> = {
      jpg: ["image/jpeg"],
      jpeg: ["image/jpeg"],
      png: ["image/png"],
      gif: ["image/gif"],
      webp: ["image/webp"],
      svg: ["image/svg+xml"],
      pdf: ["application/pdf"],
      doc: ["application/msword"],
      docx: [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      txt: ["text/plain"],
      rtf: ["application/rtf"],
      mp3: ["audio/mpeg"],
      wav: ["audio/wav"],
      ogg: ["audio/ogg"],
      m4a: ["audio/mp4"],
      mp4: ["video/mp4"],
      avi: ["video/x-msvideo"],
      mov: ["video/quicktime"],
      wmv: ["video/x-ms-wmv"],
      flv: ["video/x-flv"],
      dcm: ["application/dicom"],
      dicom: ["application/dicom"],
      nii: ["application/octet-stream"],
      nifti: ["application/octet-stream"],
    };

    return extensions.flatMap((ext) => mimeTypeMap[ext] || []);

  // Generate unique filename
  generateFileName(originalName: string, userId: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = extname(originalName);
    const baseName = originalName.replace(extension, "");
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, "_");

    return `${userId}_${timestamp}_${randomString}_${sanitizedBaseName}${extension}`;

  // Calculate file checksum
  async calculateChecksum(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hash = createHash("sha256");
    hash.update(Buffer.from(buffer));
    return hash.digest("hex");

  // Determine file type from extension
  getFileType(
    fileName: string,
  ): "image" | "document" | "audio" | "video" | "medical" {
    const extension = extname(fileName).toLowerCase().slice(1);

    if ((ALLOWED_FILE_TYPES.images as unknown as string[]).includes(extension))
      return "image";
    if (
      (ALLOWED_FILE_TYPES.documents as unknown as string[]).includes(extension)
    )
      return "document";
    if ((ALLOWED_FILE_TYPES.audio as unknown as string[]).includes(extension))
      return "audio";
    if ((ALLOWED_FILE_TYPES.video as unknown as string[]).includes(extension))
      return "video";
    if ((ALLOWED_FILE_TYPES.medical as unknown as string[]).includes(extension))
      return "medical";

    return "document"; // Default fallback

  // Get max file size for file type
  getMaxFileSize(fileType: string): number {
    switch (fileType) {
      case "image":
        return MAX_FILE_SIZES.images;
      case "document":
        return MAX_FILE_SIZES.documents;
      case "audio":
        return MAX_FILE_SIZES.audio;
      case "video":
        return MAX_FILE_SIZES.video;
      case "medical":
        return MAX_FILE_SIZES.medical;
      default:
        return MAX_FILE_SIZES.documents;
    }

  // Get allowed extensions for file type
  getAllowedExtensions(fileType: string): string[] {
    switch (fileType) {
      case "image":
        return [...ALLOWED_FILE_TYPES.images];
      case "document":
        return [...ALLOWED_FILE_TYPES.documents];
      case "audio":
        return [...ALLOWED_FILE_TYPES.audio];
      case "video":
        return [...ALLOWED_FILE_TYPES.video];
      case "medical":
        return [...ALLOWED_FILE_TYPES.medical];
      default:
        return [...ALLOWED_FILE_TYPES.documents];
    }
  }

// File storage interface
export interface FileStorage {
  upload(file: File, metadata: Partial<FileMetadata>): Promise<FileMetadata>;
  download(fileId: string): Promise<Buffer>;
  delete(fileId: string): Promise<boolean>;
  getMetadata(fileId: string): Promise<FileMetadata | null>;
  listFiles(filters: {
    userId?: string;
    patientId?: string;
    fileType?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<FileMetadata[]>;
  updateMetadata(
    fileId: string,
    updates: Partial<FileMetadata>,
  ): Promise<FileMetadata>;

// Local file storage implementation
export class LocalFileStorage implements FileStorage {
  private uploadDir: string;
  private fileHandler: FileUploadHandler;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || "./uploads";
    this.fileHandler = FileUploadHandler.getInstance();

  async upload(
    file: File,
    metadata: Partial<FileMetadata>,
  ): Promise<FileMetadata> {
    // Validate file
    const fileType = this.fileHandler.getFileType(file.name);
    const allowedExtensions = this.fileHandler.getAllowedExtensions(fileType);
    const maxSize = this.fileHandler.getMaxFileSize(fileType);

    const validation = this.fileHandler.validateFile(
      file,
      allowedExtensions,
      maxSize,
    );
    if (!validation.valid) {
      throw new Error(validation.error);

    // Generate metadata
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const fileName = this.fileHandler.generateFileName(
      file.name,
      metadata.uploadedBy || "unknown",
    );
    const filePath = `${this.uploadDir}/${fileName}`;
    const checksum = await this.fileHandler.calculateChecksum(file);

    const baseMetadata = {
      id: fileId,
      originalName: file.name,
      fileName,
      filePath,
      fileSize: file.size,
      mimeType: file.type,
      fileType,
      uploadedBy: metadata.uploadedBy || "unknown",
      tags: metadata.tags || [],
      isPublic: metadata.isPublic || false,
      isEncrypted: metadata.isEncrypted || false,
      checksum,
      uploadedAt: new Date(),
      downloadCount: 0,
    } as const;

    const fileMetadata: FileMetadata = {
      ...baseMetadata,
      ...(metadata.patientId ? { patientId: metadata.patientId } : {}),
      ...(metadata.sessionId ? { sessionId: metadata.sessionId } : {}),
      ...(metadata.appointmentId
        ? { appointmentId: metadata.appointmentId }
        : {}),
      ...(metadata.description ? { description: metadata.description } : {}),
      ...(metadata.expiresAt ? { expiresAt: metadata.expiresAt } : {}),
    } as FileMetadata;

    // Save file to disk (in a real implementation, this would be handled by the server)
    // For now, we'll just store the metadata in the database

    // Store metadata in database
    await realDB.logAudit({
      action: "FILE_UPLOAD",
      table_name: "file_metadata",
      new_values: fileMetadata,
    });

    return fileMetadata;

  async download(_fileId: string): Promise<Buffer> {
    // In a real implementation, read file from disk
    // For now, return empty buffer
    return Buffer.from("");

  async delete(fileId: string): Promise<boolean> {
    // In a real implementation, delete file from disk
    // For now, just log the deletion
    await realDB.logAudit({
      action: "FILE_DELETE",
      table_name: "file_metadata",
      record_id: fileId,
    });

    return true;

  async getMetadata(_fileId: string): Promise<FileMetadata | null> {
    // In a real implementation, query database for file metadata
    // For now, return null
    return null;

  async listFiles(_filters: {
    userId?: string;
    patientId?: string;
    fileType?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<FileMetadata[]> {
    // In a real implementation, query database for files
    // For now, return empty array
    return [];

  async updateMetadata(
    _fileId: string,
    _updates: Partial<FileMetadata>,
  ): Promise<FileMetadata> {
    // In a real implementation, update file metadata in database
    // For now, return empty metadata
    return {} as FileMetadata;
  }

// File upload API handler
export async function handleFileUpload(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const patientId = formData.get("patientId") as string;
    const sessionId = formData.get("sessionId") as string;
    const appointmentId = formData.get("appointmentId") as string;
    const tags = (formData.get("tags") as string)?.split(",") || [];
    const description = formData.get("description") as string;
    const isPublic = formData.get("isPublic") === "true";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );

    const storage = new LocalFileStorage();

    // Upload file
    const metadata = await storage.upload(file, {
      uploadedBy: userId,
      patientId,
      sessionId,
      appointmentId,
      tags,
      description,
      isPublic,
    });

    return NextResponse.json({
      success: true,
      data: {
        fileId: metadata.id,
        fileName: metadata.fileName,
        fileSize: metadata.fileSize,
        fileType: metadata.fileType,
        mimeType: metadata.mimeType,
        uploadedAt: metadata.uploadedAt,
        downloadUrl: `/api/files/download/${metadata.id}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "File upload failed" },
      { status: 500 },
    );
  }

// File download API handler
export async function handleFileDownload(
  fileId: string,
): Promise<NextResponse> {
  try {
    const storage = new LocalFileStorage();
    const metadata = await storage.getMetadata(fileId);

    if (!metadata) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 },
      );

    // Check if file is public or user has access
    if (!metadata.isPublic) {
      // In a real implementation, check user permissions
      // For now, allow download

    const fileBuffer = await storage.download(fileId);
    const arrayBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength,
    );

    // Update download count and last accessed
    await storage.updateMetadata(fileId, {
      downloadCount: metadata.downloadCount + 1,
      lastAccessedAt: new Date(),
    });

    return new NextResponse(arrayBuffer as ArrayBuffer, {
      headers: {
        "Content-Type": metadata.mimeType,
        "Content-Disposition": `attachment; filename="${metadata.originalName}"`,
        "Content-Length": metadata.fileSize.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "File download failed" },
      { status: 500 },
    );
  }

// File list API handler
export async function handleFileList(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const patientId = searchParams.get("patientId");
    const fileType = searchParams.get("fileType");
    const tags = searchParams.get("tags")?.split(",");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const storage = new LocalFileStorage();
    const filters: {
      userId?: string;
      patientId?: string;
      fileType?: string;
      tags?: string[];
      limit?: number;
      offset?: number;
    } = { limit, offset };
    if (userId) filters.userId = userId;
    if (patientId) filters.patientId = patientId;
    if (fileType) filters.fileType = fileType;
    if (tags && tags.length) filters.tags = tags;
    const files = await storage.listFiles(filters);

    return NextResponse.json({
      success: true,
      data: files,
      pagination: {
        limit,
        offset,
        total: files.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to list files" },
      { status: 500 },
    );
  }

// Export file upload handler instance
export const fileUploadHandler = FileUploadHandler.getInstance();
}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
