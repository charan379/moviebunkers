import LinkDTO from "@dto/link.dto";
import ILinksService from "./interfaces/links.service.interface";
import { Inject, Service } from "typedi";
import LinksRepository from "@repositories/links.repository";
import ILink from "@models/interfaces/ILinks";
import mongoose from "mongoose";


@Service()
class LinksService implements ILinksService {
    private linksRepository: LinksRepository;

    constructor(@Inject() linksRepository: LinksRepository) {
        this.linksRepository = linksRepository
    }

    /**
     * 
     * @param linkDto 
     */
    async create(linkDto: Partial<ILink>): Promise<LinkDTO> {
        try {
            const newLink = await this.linksRepository.create(linkDto);
            return newLink as LinkDTO;
        } catch (error) {
            throw error;
        }
    }

    async getAllByParentId(parentId: string): Promise<LinkDTO[]> {
        try {
            let linkDTOs: LinkDTO[] = [];
            const links: ILink[] = await this.linksRepository.getAllByParentId(new mongoose.Types.ObjectId(parentId));
            links.map(ilink => {
                linkDTOs.push(ilink)
            })
            return linkDTOs
        } catch (error) {
            throw error;
        }
    }
    deleteById(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateById(id: string): Promise<LinkDTO> {
        throw new Error("Method not implemented.");
    }

}

export default LinksService;