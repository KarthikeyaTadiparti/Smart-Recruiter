import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ExpressError from '../utils/ExpressError';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

interface GeneratePdfResult {
    imageUrl: string | null;
    pdfUrl: string | null;
}

export const generatePdfandPreview = async (
    html: string,
    resumeId: string
): Promise<GeneratePdfResult> => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(resolve => setTimeout(resolve, 100));
    await page.setViewport({ width: 794, height: 1123 });

    
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
            top: '48px',
            bottom: '48px',
            left: '32px',
            right: '32px',
        },
    });
    const screenshotBuffer = await page.screenshot({ fullPage: false });

    await browser.close();

    const date = new Date().toISOString();

    // Upload Preview Image
    const webpBuffer = await sharp(screenshotBuffer)
        .resize(794, 1123)
        .webp()
        .toBuffer();

    const previewPath = `${resumeId}+${date}.webp`;
    const { error: imageError } = await supabase.storage
        .from('resume-previews')
        .upload(previewPath, webpBuffer, {
            contentType: 'image/webp',
            upsert: true,
        });

    const imageUrl = imageError
        ? null
        : `${process.env.SUPABASE_URL}/storage/v1/object/public/resume-previews/${previewPath}`;

    // Upload PDF
    const pdfPath = `${resumeId}+${date}.pdf`;
    const { error: pdfError } = await supabase.storage
        .from('resume-pdf')
        .upload(pdfPath, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true,
        });

    const pdfUrl = pdfError
        ? null
        : `${process.env.SUPABASE_URL}/storage/v1/object/public/resume-pdf/${pdfPath}`;

    return {
        imageUrl,
        pdfUrl,
    };
};

export const deletePdfandPreview = async (resumeId: string): Promise<void> => {
    // --- Delete Preview Images ---
    const { data: previewFiles, error: previewListError } = await supabase.storage
        .from('resume-previews')
        .list('', {
            limit: 100,
            search: `${resumeId}+`,
        });

    if (previewListError) {
        throw new ExpressError(500, `Supabase preview listing error: ${previewListError.message}`);
    }

    const previewFilesToDelete = (previewFiles || [])
        .filter(file => file.name.startsWith(`${resumeId}+`))
        .map(file => file.name);

    if (previewFilesToDelete.length > 0) {
        const { error: previewDeleteError } = await supabase.storage
            .from('resume-previews')
            .remove(previewFilesToDelete);

        if (previewDeleteError) {
            throw new ExpressError(500, `Supabase preview deletion error: ${previewDeleteError.message}`);
        }
    }

    // --- Delete PDF Files ---
    const { data: pdfFiles, error: pdfListError } = await supabase.storage
        .from('resume-pdf')
        .list('', {
            limit: 100,
            search: `${resumeId}+`,
        });

    if (pdfListError) {
        throw new ExpressError(500, `Supabase PDF listing error: ${pdfListError.message}`);
    }

    const pdfFilesToDelete = (pdfFiles || [])
        .filter(file => file.name.startsWith(`${resumeId}+`) && file.name.endsWith('.pdf'))
        .map(file => file.name);

    if (pdfFilesToDelete.length > 0) {
        const { error: pdfDeleteError } = await supabase.storage
            .from('resume-pdf')
            .remove(pdfFilesToDelete);

        if (pdfDeleteError) {
            throw new ExpressError(500, `Supabase PDF deletion error: ${pdfDeleteError.message}`);
        }
    }
};

export const downloadResumePdf = async (
    resumeId: string
): Promise<{ base64Data: string }> => {
    if (!resumeId) {
        throw new ExpressError(400, 'Resume ID is required.');
    }

    // Step 1: Find the latest PDF matching resumeId
    const { data: files, error: listError } = await supabase.storage
        .from('resume-pdf')
        .list('', {
            limit: 100,
            search: `${resumeId}+`,
        });

    if (listError || !files || files.length === 0) {
        throw new ExpressError(404, `No PDF file found for resume ID: ${resumeId}`);
    }

    const matchedFile = files
        .filter(file => file.name.startsWith(`${resumeId}+`) && file.name.endsWith('.pdf'))
        .sort((a, b) => b.name.localeCompare(a.name))[0];

    if (!matchedFile) {
        throw new ExpressError(404, `No valid PDF file found for resume ID: ${resumeId}`);
    }

    // Step 2: Download the file
    const { data: fileData, error: downloadError } = await supabase.storage
        .from('resume-pdf')
        .download(matchedFile.name);

    if (downloadError || !fileData) {
        throw new ExpressError(500, `Failed to download resume PDF: ${downloadError?.message}`);
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    return {
        base64Data,
    };
}
